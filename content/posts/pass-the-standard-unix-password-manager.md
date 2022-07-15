---
title: "Pass: The Standard Unix Password Manager"
description: "Setting up Pass: The Standard Unix Password Manager to manage passwords."
date: 2021-02-04T00:00:00-04:00
---

[Pass](https://www.passwordstore.org/) is a simple password manager that strictly
follows the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy). It simply
provides a directory structure of GPG encrypted files containing passwords and other
information for each password. In this post I will go over how to initialize Pass and
different ways of interacting with it.

## Setup

If you don't have a GPG key we need to generate one with:

```bash
gpg --full-generate-key
```

In order to use this key with Pass run the command:

```bash
gpg --list-secret-keys --keyid-format LONG
```

This will show details of your key. Look for a line that looks something like this:

```text
sec    rsa2048/0D2740AEE2FAEA2B 2021-01-07 [SC]
```

We need to copy the string after the line `rsa2048/` until the date. With this we can
create our password store by running:

```bash
pass init "0d2740AEE2FAEA2B"
```

Now we have created our password store and can start adding passwords to it by doing:

```bash
pass insert <CATEGORY>/<SUBCATEGORY>/<NAME>
```

For example to add an entry for an email address we would enter:

```bash
pass insert email/gmail/miika@gmail.com
```

This will prompt us to enter a password and the contents will be saved into a GPG
protected file with our key. The location of this file will be in
`~/.password-store/email/gmail/miika@gmail.com`.

In order to decrypt this file and get its content we can run:

```bash
pass email/gmail/miika@gmail.com
```

This will echo the output in the terminal.

Now we have a GPG encrypted file that contains your password. To add other information
to this file such as a username and URI we can run:

```bash
pass edit email/gmail/miika@gmail.com
```

Since this is just a GPG encrypted file you are free to edit it to your liking, but the
preferred organizational scheme used by the author of Pass looks like this:

```text
Yw|ZSNH!}z"6{ym9pI
URL: *.amazon.com/*
Username: AmazonianChicken@example.com
Secret Question 1: What is your childhood best friend's most bizarre superhero fantasy? Oh god, Amazon, it's too awful to say...
Phone Support PIN #: 84719
```

## Pass-OTP

Pass-otp is an extension for pass that allows for two factor authentication support. To
add an OTP secret to our account we can run:

```bash
pass otp append -a -s email/gmail/miika@gmail.com
```

You can also get the OTP secret from a QR code by running:

```bash
zbarimg -q --raw qrcode.png | pass otp insert totp-secret
```

## Frontends to Pass

To interact with pass outside of the terminal there are a couple helpful extensions.
Since I use dmenu there is a dmenu script that comes with Pass. You can run it with
`passmenu` as long as you have dmenu installed.

There is also an Emacs package called `password-store` which allows you to copy
passwords to your kill-ring from Emacs. I use both of these frontends depending on my
workflow.

## Afterword

To learn more about Pass you can check the official website at
[](https://www.passwordstore.org/). They also have a list of other extensions and
conversion tools to migrate from other password managers.
