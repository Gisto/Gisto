#include <node.h>

using namespace v8;

void GetClientId(const v8::FunctionCallbackInfo<v8::Value>& info) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  info.GetReturnValue().Set(String::New("clientId"));
}

void GetClientSecret(const v8::FunctionCallbackInfo<v8::Value>& info) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  info.GetReturnValue().Set(String::New("clientSecret"));
}

void GetServerToken(const v8::FunctionCallbackInfo<v8::Value>& info) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  info.GetReturnValue().Set(String::New("serverToken"));
}

void InitAll(Handle<Object> exports) {
  exports->Set(String::NewSymbol("getClientId"),
      FunctionTemplate::New(GetClientId)->GetFunction());

  exports->Set(String::NewSymbol("getClientSecret"),
      FunctionTemplate::New(GetClientSecret)->GetFunction());

  exports->Set(String::NewSymbol("getServerToken"),
      FunctionTemplate::New(GetServerToken)->GetFunction());
}

NODE_MODULE(gistoConf, InitAll)
