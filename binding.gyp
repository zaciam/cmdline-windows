{
  "targets": [
    {
      "target_name": "cmdline",
      "sources": ["cmdline-windows.cpp", "addon.cpp"],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")"
      ],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"]
    }
  ]
}
