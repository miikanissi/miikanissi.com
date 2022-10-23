---
title: "Email Setup With Mbsync + Mu4e"
date: 2021-04-18T00:00:00-04:00
description:
  "Mu4e is a powerful email client for Emacs. This post is a guide on setting up mu4e
  email client with mbsync."
---

Mu4e is a powerful email client for Emacs. It is rather simple to use and having your
mail in Emacs is the best thing ever. I recently started using mu4e as my email client,
and it turns out configuring it is a bit of a hassle. This post works as a guide on
setting up mu4e email client for Emacs with mbsync to sync email.

## Pass To Securely Store Your Passwords

To be able to store your email password securely, you need to set up GPG and pass. I
have previously made a post on [configuring
pass]({{< relref "pass-the-standard-unix-password-manager.md" >}}) so take a look at it
before you proceed.

Every time you want to add a new email, make sure you add a pass entry for it first.

## Setting up Mbsync

To fetch and sync email from the mail server using IMAP, you need to use
[isync/mbsync](https://wiki.archlinux.org/index.php/isync). First, you need to install
this on your system with your package manager.

For Arch Linux:

```bash
sudo pacman -S isync
```

For Ubuntu 20.04+:

```bash
sudo apt install isync
```

Mbsync configuration file is located at `~/.mbsyncrc`. A typical configuration looks as
follows (replace the content between <,> with values provided by your email provider):

```text
IMAPAccount <account>
Host <imap.host.tld>
Port <993>
User <email username>
PassCmd "pass <account>"
SSLType IMAPS
CertificateFile /etc/ssl/certs/ca-certificates.crt

IMAPStore <account>-remote
Account <account>

MaildirStore <account>-local
SubFolders Verbatim
Path ~/Mail/<account>/
Inbox ~/Mail/<account>/Inbox
Trash ~/Mail/<account>/Trash

Channel <account>
Far :<account>-remote:
Near :<account>-local:
;; Patterns are the names of your mail folders. You can also use * for all of your mail folders.
Patterns INBOX "Sent Items" Drafts Trash Spam?
SyncState *
Create Both
Expunge Both
CopyArrivalDate yes
Sync All
```

**Note**: If you have 2FA enabled, you might need to use an app specific password.
Confirm this from your email provider.

**Note2**: See
[ArchWiki article about isync](https://wiki.archlinux.org/index.php/isync) for more
configuration options and tips.

Make sure to create the root folder used in the mbsync configuration:

```bash
mkdir -p ~/Mail/<account>
```

If everything was configured correctly, you can now sync your email to your local
folder:

```bash
mbsybc <account>
```

## Mu4e

Mu4e, the Emacs mail client, comes included with the mu, mail indexing program. You can
get mu directly from their [GitHub page](https://github.com/djcb/mu) or various package
managers.

For Arch Linux with AUR helper yay:

```bash
yay -S mu
```

For Ubuntu 20.04+:

```bash
sudo apt install maildir-utils
```

Mu4e configuration for Emacs (replace content between <,> with your own values):

```elisp
(use-package mu4e
  :ensure nil
  :defer 5
  :load-path "/usr/share/emacs/site-lisp/mue4/"
  :config
  (require 'org-mu4e)

  ;; refresh mbsync every 10 minutes
  (setq mu4e-update-interval (* 10 60))
  (setq mu4e-get-mail-command "mbsync -a")
  (setq mu4e-maildir "<maildir>")
  ;; use pass to store passwords
  ;; file auth looks for is ~/.password-store/<smtp.host.tld>:<port>/<name>
  (auth-source-pass-enable)
  (setq auth-sources '(password-store))
  (setq auth-source-debug t)
  (setq auth-source-do-cache nil)
  ;; no reply to self
  (setq mu4e-compose-dont-reply-to-self t)
  (setq mu4e-compose-keep-self-cc nil)
  ;; moving messages renames files to avoid errors
  (setq mu4e-change-filenames-when-moving t)
  ;; Configure the function to use for sending mail
  (setq message-send-mail-function 'smtpmail-send-it)
  ;; Display options
  (setq mu4e-view-show-images t)
  (setq mu4e-view-show-addresses 't)
  ;; Composing mail
  (setq mu4e-compose-dont-reply-to-self t)
  ;; don't keep message buffers around
  (setq message-kill-buffer-on-exit t)
  ;; Don't ask for a 'context' upon opening mu4e
  (setq mu4e-context-policy 'pick-first)
  ;; Don't ask to quit... why is this the default?
  (setq mu4e-confirm-quit nil)

  ;; Set up contexts for email accounts
  (setq mu4e-contexts
        (list
         (make-mu4e-context
          :name "<mail account name>"
          :match-func
      (lambda (msg)
            (when msg
              (string-prefix-p "/<mail account dir>" (mu4e-message-field msg :maildir))))
          :vars `((user-mail-address . "<mail address>")
                  (user-full-name    . "<mail full name>")
                  (smtpmail-smtp-server  . "<smtp.host.tld>")
                  (smtpmail-smtp-service . "<smtp port>")
                  (smtpmail-stream-type  . ssl)
                  (smtpmail-smtp-user . "<email username>")
                  (mu4e-compose-signature . "<email signature>")
                  (mu4e-drafts-folder  . "<mail account dir>/<draft dir>")
                  (mu4e-sent-folder  . "<mail account dir>/<sent dir>")
                  (mu4e-refile-folder  . "<mail account dir>/<archive dir>")
                  (mu4e-trash-folder  . "<mail account dir>/<trash dir>")))))

  (setq m/mu4e-inbox-query
        "(maildir:/<mail account dir>/<inbox dir>) AND flag:unread")
  (defun m/go-to-inbox ()
    (interactive)
    (mu4e-headers-search m/mu4e-inbox-query))
  ;; start mu4e
  (mu4e t))
```

**Note**: Mu4e looks for your password file in
`~/.password-store/<smtp.host.tld>:<port>/<mail account name>`

This is a rather basic configuration for one email account. For my full configuration
you can check my
[dotfiles on GitHub](https://github.com/miikanissi/dotfiles/tree/master/.emacs.d/).

## Afterword

If everything was configured correctly, you should now be able to read and send email
from Emacs using mu4e. If you need any help with your configuration, don't hesitate to
contact me with email: [miika@miikanissi.com](mailto:miika@miikanissi.com).
