<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}">

    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    <meta property="og:url" content="{{ $ogUrl }}">
    @if($ogImage)
    <meta property="og:image" content="{{ $ogImage }}">
    <meta property="og:type" content="website">
    @endif

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $title }}">
    <meta name="twitter:description" content="{{ $description }}">
    <meta name="twitter:url" content="{{ $ogUrl }}">
    @if($ogImage)
    <meta name="twitter:image" content="{{ $ogImage }}">
    @endif

    <meta http-equiv="refresh" content="0;url={{ $targetUrl }}">
</head>
<body>
    <p><a href="{{ $targetUrl }}">Перейти на страницу</a></p>
    <script>window.location.replace({!! json_encode($targetUrl) !!});</script>
</body>
</html>
