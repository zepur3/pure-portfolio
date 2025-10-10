<?php
// Charger les variables d'environnement
$env_file = __DIR__ . '/../../.env.local';
if (file_exists($env_file)) {
    $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!empty($name)) {
            putenv("$name=$value");
            $_ENV[$name] = $value;
        }
    }
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');

// Si c'est une requête OPTIONS (pre-flight), on s'arrête ici
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Vérifier si la requête est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

// Récupérer les données JSON envoyées
$data = json_decode(file_get_contents('php://input'), true);

// Vérifier que toutes les données requises sont présentes
if (!isset($data['name']) || !isset($data['email']) || !isset($data['subject']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Tous les champs sont requis']);
    exit;
}

// Vérification du token reCAPTCHA
if (isset($data['recaptchaToken'])) {
    $recaptcha_token = $data['recaptchaToken'];
    $recaptcha_secret = getenv('RECAPTCHA_SECRET_KEY');
    
    if (empty($recaptcha_token)) {
        http_response_code(400);
        echo json_encode(['error' => 'Veuillez confirmer que vous n\'êtes pas un robot']);
        exit;
    }
    
    // Vérification du token reCAPTCHA avec l'API Google
    $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
    $recaptcha_data = [
        'secret' => $recaptcha_secret,
        'response' => $recaptcha_token,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];
    
    $recaptcha_options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($recaptcha_data)
        ]
    ];
    
    $recaptcha_context = stream_context_create($recaptcha_options);
    $recaptcha_result = file_get_contents($recaptcha_url, false, $recaptcha_context);
    $recaptcha_response = json_decode($recaptcha_result);
    
    if (!$recaptcha_response->success) {
        http_response_code(400);
        echo json_encode(['error' => 'La vérification reCAPTCHA a échoué. Veuillez réessayer.']);
        exit;
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Vérification reCAPTCHA requise']);
    exit;
}

// Protection anti-spam basique - vérifier si le message a été envoyé trop rapidement
// (moins de 3 secondes après le chargement du formulaire)
$min_submission_time = getenv('MIN_SUBMISSION_TIME') ? intval(getenv('MIN_SUBMISSION_TIME')) : 3;
if (isset($data['timestamp']) && (time() - intval($data['timestamp']) < $min_submission_time)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formulaire soumis trop rapidement. Veuillez réessayer.']);
    exit;
}

// Récupérer et nettoyer les données du formulaire
$name = filter_var(trim($data['name']), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$subject = filter_var(trim($data['subject']), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$message = filter_var(trim($data['message']), FILTER_SANITIZE_FULL_SPECIAL_CHARS);

// Validation supplémentaire
if (empty($name) || strlen($name) > 100) {
    http_response_code(400);
    echo json_encode(['error' => 'Le nom est invalide ou trop long']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Adresse email invalide']);
    exit;
}

if (empty($subject) || strlen($subject) > 200) {
    http_response_code(400);
    echo json_encode(['error' => 'Le sujet est invalide ou trop long']);
    exit;
}

if (empty($message) || strlen($message) > 3000) {
    http_response_code(400);
    echo json_encode(['error' => 'Le message est invalide ou trop long']);
    exit;
}

// Protection anti-spam supplémentaire - vérifier les mots-clés de spam courants
$spam_keywords = ['viagra', 'cialis', 'casino', 'lottery', 'winner', 'buy now', 'free money'];
foreach ($spam_keywords as $keyword) {
    if (stripos($message, $keyword) !== false || stripos($subject, $keyword) !== false) {
        http_response_code(400);
        echo json_encode(['error' => 'Votre message a été identifié comme spam potentiel']);
        exit;
    }
}

// Journalisation des tentatives d'envoi (optionnel, pour le débogage)
$log_file = __DIR__ . '/contact_log.txt';
$log_entry = date('Y-m-d H:i:s') . " | IP: " . $_SERVER['REMOTE_ADDR'] . " | Email: $email | Sujet: $subject\n";
file_put_contents($log_file, $log_entry, FILE_APPEND);

// Adresse email de destination
$to = getenv('EMAIL_TO') ? getenv('EMAIL_TO') : 'contact@asdinfor.ovh';
$email_from = getenv('EMAIL_FROM') ? getenv('EMAIL_FROM') : $to;
$subject_prefix = getenv('EMAIL_SUBJECT_PREFIX') ? getenv('EMAIL_SUBJECT_PREFIX') : 'Nouveau message de contact: ';

// En-têtes de l'email
$headers = [
    'From' => "Portfolio Contact <$email_from>",
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/html; charset=UTF-8'
];

// Corps de l'email en HTML
$email_content = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h2 {
            color: #4a5568;
        }
        .message-box {
            background-color: #f7fafc;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> " . htmlspecialchars($name) . "</p>
        <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
        <p><strong>Sujet:</strong> " . htmlspecialchars($subject) . "</p>
        <div class='message-box'>
            <p><strong>Message:</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
        </div>
        <p><small>IP de l'expéditeur: " . $_SERVER['REMOTE_ADDR'] . "</small></p>
    </div>
</body>
</html>
";

// Tentative d'envoi de l'email
$mail_sent = mail($to, $subject_prefix . $subject, $email_content, $headers);

if ($mail_sent) {
    // Limiter le nombre d'emails par IP (protection anti-spam)
    $ip_log_file = __DIR__ . '/ip_log.txt';
    $current_ip = $_SERVER['REMOTE_ADDR'];
    $ip_log = file_exists($ip_log_file) ? file_get_contents($ip_log_file) : '';
    $ip_count = substr_count($ip_log, $current_ip . '|' . date('Y-m-d'));
    
    $max_emails_per_ip = getenv('MAX_EMAILS_PER_IP') ? intval(getenv('MAX_EMAILS_PER_IP')) : 5;
    if ($ip_count > $max_emails_per_ip) {
        http_response_code(429);
        echo json_encode(['error' => 'Trop de messages envoyés aujourd\'hui. Veuillez réessayer demain.']);
        exit;
    }
    
    // Enregistrer l'IP pour limiter le nombre d'emails
    file_put_contents($ip_log_file, $current_ip . '|' . date('Y-m-d') . "\n", FILE_APPEND);
    
    echo json_encode(['message' => 'Email envoyé avec succès']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'envoi de l\'email']);
}
