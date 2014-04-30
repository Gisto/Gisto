function extraBin(arg) {
    switch (arg) {
        case "client_id":
            return "SECRET STRING HERE";
            break;
        case "app_secret":
            return "SECRET STRING HERE";
            break;
        case "server_token":
            return "SECRET STRING HERE";
            break;
        default:
            console.log("Nothing in bin extraBin()");
    }
}