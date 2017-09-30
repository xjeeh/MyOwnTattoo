var constantsMyOwn = {
    //baseAPIUrl: "http://localhost/MyOwn.Tattoo.WebAPI/api",
    baseAPIUrl: window.location.origin + "/AgendamentoAPI/api",

    //pagseguroAPIUrl: "https://sandbox.pagseguro.uol.com.br/v2",
    pagseguroAPIUrl: "https://sandbox.pagseguro.uol.com.br/v2",
}

localStorage.setItem("baseAPIUrl", constantsMyOwn.baseAPIUrl);
localStorage.setItem("pagseguroAPIUrl", constantsMyOwn.pagseguroAPIUrl);