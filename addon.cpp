#include <node_api.h>
#include <string>
#include <codecvt>

std::string GetCommandLineFromProcess(uint32_t pid);

napi_value GetCmdline(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1];
    napi_value result;

    napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);

    if (argc < 1) {
        napi_throw_type_error(env, nullptr, "Invalid argument. PID must be a number.");
        return nullptr;
    }

    uint32_t pid;
    napi_get_value_uint32(env, args[0], &pid);

    napi_create_string_utf8(env, GetCommandLineFromProcess(pid).c_str(), NAPI_AUTO_LENGTH, &result);

    return result;
}

napi_value InitAddon(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
        {"getCmdline", nullptr, GetCmdline, nullptr, nullptr, nullptr, napi_default, nullptr},
    };

    napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc);

    return exports;
}

napi_value Init(napi_env env, napi_value exports) {
    return InitAddon(env, exports);
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);
