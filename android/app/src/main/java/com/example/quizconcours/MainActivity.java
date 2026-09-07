package com.example.quizconcours;

import android.app.Activity;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String TAG = "QuizConcours";
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        // Hardware acceleration for responsive transitions
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        );

        webView = new WebView(this);
        // Neutral background color matching the app (#f3f4f6)
        webView.setBackgroundColor(0xFFF3F4F6);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        String defaultUa = settings.getUserAgentString();
        if (defaultUa != null) {
            settings.setUserAgentString(defaultUa + " QuizAppNativeAndroid/1.12.0");
        }

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage cm) {
                Log.d("WebConsole", "[" + cm.messageLevel() + "] " + cm.message() +
                        " -- line " + cm.lineNumber() + " in " + cm.sourceId());
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                Log.d(TAG, "onPageStarted: " + url);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                Log.d(TAG, "onPageFinished: " + url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    Log.e(TAG, "onReceivedError: " + error.getErrorCode() + " - " + error.getDescription() + " on " + request.getUrl());
                }
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return handleAssetRequest(request.getUrl());
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                return handleAssetRequest(Uri.parse(url));
            }
        });

        // Load virtual https://localhost domain with mode=native_apk.
        // Intercepted locally from assets/www, ensuring NO CORS or file:// null origin block!
        webView.loadUrl("https://localhost/index.html?mode=native_apk");
    }

    private WebResourceResponse handleAssetRequest(Uri uri) {
        if (uri == null) return null;
        String host = uri.getHost();
        String scheme = uri.getScheme();
        String path = uri.getPath();

        // Match local hostnames or file:// schemes
        boolean isLocalHost = "localhost".equalsIgnoreCase(host) ||
                              "127.0.0.1".equals(host) ||
                              "appassets.androidplatform.net".equalsIgnoreCase(host) ||
                              (scheme != null && scheme.equalsIgnoreCase("file"));

        if (!isLocalHost && (path == null || !path.contains("assets/"))) {
            return null; // Let non-local network requests proceed normally
        }

        if (path == null || path.isEmpty() || path.equals("/")) {
            path = "/index.html";
        }

        // Convert path to assets/www relative path
        String assetPath = path;
        while (assetPath.startsWith("/")) {
            assetPath = assetPath.substring(1);
        }
        if (assetPath.startsWith("android_asset/")) {
            assetPath = assetPath.substring("android_asset/".length());
        }
        if (!assetPath.startsWith("www/")) {
            assetPath = "www/" + assetPath;
        }

        try {
            AssetManager am = getAssets();
            InputStream is = am.open(assetPath);
            String mime = getMimeType(assetPath);

            Map<String, String> headers = new HashMap<>();
            headers.put("Access-Control-Allow-Origin", "*");
            headers.put("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            headers.put("Access-Control-Allow-Headers", "*");
            headers.put("Cache-Control", "no-cache");

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                return new WebResourceResponse(mime, "UTF-8", 200, "OK", headers, is);
            } else {
                return new WebResourceResponse(mime, "UTF-8", is);
            }
        } catch (IOException e) {
            Log.w(TAG, "Asset not found: " + assetPath + " (" + e.getMessage() + ")");
            // Fallback: check if requested path is index.html
            if (path.endsWith("index.html") || path.equals("/index.html") || path.equals("/")) {
                try {
                    InputStream is = getAssets().open("www/index.html");
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Access-Control-Allow-Origin", "*");
                    return new WebResourceResponse("text/html", "UTF-8", 200, "OK", headers, is);
                } catch (IOException ignored) {}
            }
            return null;
        }
    }

    private String getMimeType(String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
        if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".json")) return "application/json";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".ico")) return "image/x-icon";
        if (lower.endsWith(".woff2")) return "font/woff2";
        if (lower.endsWith(".woff")) return "font/woff";
        if (lower.endsWith(".ttf")) return "font/ttf";
        if (lower.endsWith(".mp3")) return "audio/mpeg";
        if (lower.endsWith(".wav")) return "audio/wav";
        return "application/octet-stream";
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
