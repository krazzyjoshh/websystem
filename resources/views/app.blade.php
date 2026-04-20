<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="SHOP HUB - Premium E-Commerce Platform. Discover the perfect harmony of quality and value.">
    <title>SHOP HUB</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    @php
        $entry = 'resources/js/app.jsx';
        $isViteDev = file_exists(public_path('hot'));
        if ($isViteDev) {
            $viteUrl = rtrim(file_get_contents(public_path('hot')));
        } else {
            $manifestPath = public_path('build/manifest.json');
            $manifest = file_exists($manifestPath) ? json_decode(file_get_contents($manifestPath), true) : [];
        }
    @endphp

    @if($isViteDev)
        <script type="module" src="{{ $viteUrl }}/@vite/client"></script>
        <script type="module">
            import RefreshRuntime from '{{ $viteUrl }}/@react-refresh'
            RefreshRuntime.injectIntoGlobalHook(window)
            window.$RefreshReg$ = () => {}
            window.$RefreshSig$ = () => (type) => type
            window.__vite_plugin_react_preamble_installed__ = true
        </script>
        <script type="module" src="{{ $viteUrl }}/{{ $entry }}"></script>
    @else
        @if(isset($manifest[$entry]))
            @if(isset($manifest[$entry]['css']))
                @foreach($manifest[$entry]['css'] as $css)
                    <link rel="stylesheet" href="{{ asset('build/' . $css) }}">
                @endforeach
            @endif
            <script type="module" src="{{ asset('build/' . $manifest[$entry]['file']) }}"></script>
        @endif
    @endif
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
