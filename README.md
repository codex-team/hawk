# [Hawk.so](https://hawk.so)

Fast and lightweight errors tracking service.

[Platform documentation](#platform-documentation) 

[Getting Started](#getting-started) 

[Create an account](#create-account) 

[Register domain](#register-domain) 

[Integration](#integration) 

[Add server handler](#add-server-handler) 

[Add client catcher](#add-client-catcher) 

[Notifications](#notifications) 

[Archiving](#archiving) 

[Our team](#our-team)

<a name="platform-documentation"></a>Platform documentation
======================

Hawk.so is a clever and easy-to-use errors tracker. It collects all your code exceptions and errors and helps you to improve applications.

Please, welcome to the simple user guide.

<a name="getting-started"></a>Getting Started
---------------

Integration scheme contains a three steps. Your need to register, add a domain and install one of the Catchers.

### <a name="create-account"></a>Create an account

Follow [/join](https://hawk.so/join) link to access registration form. Leave working email, and we will send you a password. You can change it at any time later.

After that you'll be entranced by internal section. We call it the Garage.

### <a name="register-domain"></a>Register domains

Now, look at the Sidebar. There will appear all your registered domains. Touch «[Add domain](https://hawk.so/websites/create)» button to create your first.

Fill domain's name and submit a form. Now you have an Integration Token.

<a name="integration"></a>Integration
-----------

All registration procedures passed, next step is an installation of the some error Catchers. They're simple scripts that collect exceptions and deliver them to the Garage.

### <a name="add-server-handler"></a>Add the Server Handler

Currently, we provide Catchers for the next technologies:

*   [PHP](https://github.com/codex-team/hawk.php)
*   [Python](https://github.com/codex-team/hawk.python)
*   [Android](https://github.com/codex-team/hawk.android)
*   [Kotlin](https://github.com/codex-team/hawk.kotlin)
*   [Scala](https://github.com/codex-team/hawk.scala)
*   [Node.js](https://github.com/codex-team/hawk.nodejs)

This list will be expanded soon. If you can code, you can implement your own Catcher.

### <a name="add-client-catcher"></a>Add the Client Handler

To deliver JavaScript errors we provide the fast and non-blocking Socket-based Catcher.

[Get JavaScript Catcher](https://github.com/codex-team/hawk.javascript)

How to use. Include <script> tag loaded from the CDN or local cloned exemplar.

```html 
<script src="hawk.js" async></script>
```

Next, initialize the module with your Integration Token.

```html 
<script>
    hawk.init({token: “INTEGRATION_TOKEN”});
</script>
```

#### Source map support

Hawk supports JS SourceMaps for showing more useful information from your minified bundle. There a few conditions:

1.  Bundle ends with line contains anchor to the source map, like `//# sourceMappingURL=all.min.js.map`. It can be absolute or relative (relatively the bundle) path.
2.  Source map are publicly available by its URL.
3.  On every rebuilding you are updating the revision and pass it with \`init\` method. It can be heximal-hash or simply file's modification timestamp.

```js
hawk.init({token: 'INTEGRATION_TOKEN', revision: 12345654345})
```

### <a name="notifications"></a>Notifications

You can get notifications about catched errors to the Email, Telegram or Slack. For the last two types, we use Webhooks, so you free to use an any webhook bot, for example, our — [@codex_bot](https://github.com/codex-bot/Webhooks/blob/master/README.md).

Note about Webhook's query format. It is a POST-request with the message field contains notification's text.

To setup Notifications, open the [Settings](https://hawk.so/garage/settings) page, find a Project and click on the «Configure Webhooks» button. Then add Webhook endpoints for the Slack or Telegram and press «Save». Don't forget to activate checkboxes for the selected types.

### <a name="archiving"></a>Archiving

Hawk now in a public beta stage. So we allow to collect up to {{ eventsLimit|counter }} events of different types by a Project. You can have a several Projects at one account.

### <a name="our-team"></a>Our team

[CodeX](https://ifmo.su) is a small team of enthusiasts. We love web-development, build social and media services and trying to grow ourselves.

Please, leave a feedback on the our email [team@ifmo.su](mailto:team@ifmo.su?subject=Hawk). We REALLY appreciate this. And thanks for reading.
