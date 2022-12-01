# Securify

<img src="icons/"/>

É uma extensão para Firefox desenvolvida com o intuito de detectar ataques à privacidade do usuário.
As seguintes features foram implementadas:
* detecção de conexões a domínios de terceira parte em uma navegação web
* detecção de armazenamento de dados a partir do storage local no dispositivo do usuário
* quantidade de cookies injetados pelo site e se eles são de primeira ou terceira parte ou de sessao ou navegação
* detecção se o site possui alguma política de privacidade
* score indicando se o site pode ser considerado seguro ou não a partir das métricas coletadas

## Configuração inicial
Foam definidos no arquivo `manifest.json` as configurações do plugin, como as permissões necessárias, o ícone do plugin, os scripsts a serem usados.
``` json
{
    "browser_action": {
      "browser_style": true,
      "default_title": "List cookies in the active tab",
      "default_popup": "securify.html",
      "default_icon": {
        "19": "icons/eye-black.png"
      }
    },
    "description": "List cookies in the active tab.",
    "icons": {
      "48": "icons/eye.png"
    },
    "homepage_url": "https://github.com/mdn/webextensions-examples/tree/master/list-cookies",
    "manifest_version": 2,
    "name": "Securify",
    "version": "1.0",
    "permissions": ["cookies","<all_urls>","tabs","storage", "http://*/*", "https://*/*"],
    "content_scripts": [
      {
        "matches": ["*://*/*"],
        "js": ["securify.js"]
      }
    ]
  }
```

## Imlementação
### Coleta dos cookies
Os cookies foram coletados a partir do método `browser.cookies.getAll`, que retorna um objeto com diferentes atributos como cookie.session para determinar se ele é de navegação ou de sessão. Já para determinar se o cookie era de terceira parte ou não, foi feita a análise do domíno do href do cookie a partir do Regex.


### Análise do link a terceiros e Verificação de política de privacidade
Para isso, foi feita a coleta do código fonte da página. Para a coleta dos links, foram analisados aqueles que faziam parte de outros domínios a partir do Regex. Já para a verificaçã da política de privacidade, foi analisado se a página continha alguma menção a termos como "politica"ou "privacidade". Este método apesar de não muito eficiente, consegue trazer algumas informações interessantes.

### Coleta do storage local
Os dados de armazenamento local foram coletados a partir do envio de mensagens, pelo navegador, entre diferentes contextos da extensão.

### Cálculo do score de privacidade
Para esse cálculo foi adotada um diferente peso para cada métrica coletada, como pode ser observado a seguir:

``` js
score = (first_count*0.2 + third_count*0.4 + storage_count*0.5 + 1*hasPrivacyPolicy)*isSecure;
```

Caso o site não utilize o protocolo https, ele é automaticamente considerado inseguro. Assim foram determinados os seguintes ratings: 
* A - score < 3
* B - score entre 3 e 5
* C - score entre 5 e 7
* D - score > 7
* I - não possui https


## Referências
* https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/Cookie
* https://github.com/mdn/webextensions-examples/blob/master/list-cookies/icons/default38.png




