---
title: "Website With Emacs"
description: "Making a static website with Emacs Org-mode."
date: 2021-03-21T00:00:00-04:00
---

**NOTE**: I am no longer using this setup for my website.

In this post I will briefly go over my setup of using
[Emacs Org-mode](https://orgmode.org/) for managing and publishing my blog website.

## Workflow

I write all of my posts and static sites in Org-mode within Emacs and when I want to
update my site I run a custom publishing function which exports Org-mode files into
html. My custom function also creates a sitemap for my blog posts and an RSS feed.

## Setup

My setup is in my Emacs configuration file which you can find in its entirety from my
[GitHub](https://github.com/miikanissi/dotfiles/tree/master/.emacs.d/).

### File structure

```bash
root
├── org
│   ├── about.org
│   ├── blog
│   │   └── post1.org
│   ├── css
│   │   └── site.css
│   ├── html
│   │   ├── html_head.html
│   │   ├── html_postamble.html
│   │   └── html_preamble.html
│   ├── img
│   │   ├── favicon.ico
│   │   └── miika.jpg
│   ├── index.org
│   ├── rss.org
│   └── sitemap.org
└── www
    ├── about.html
    ├── blog
    │   └── post1.html
    ├── css
    │   └── site.css
    ├── img
    │   ├── favicon.ico
    │   └── miika.jpg
    ├── index.html
    ├── rss.xml
    └── sitemap.html

9 directories, 19 files
```

## Sitemap / Blog Index

These functions are used to format a sitemap to have a date for each entry.

```elisp
(defun m/org-publish-org-sitemap (title list)
  "Sitemap generation function."
  (concat "#+TITLE: Sitemap\n\n"
          (org-list-to-subtree list)))

(defun m/org-publish-org-sitemap-format-entry (entry style project)
  (cond ((not (directory-name-p entry))
         (let* ((date (org-publish-find-date entry project)))
           (format "%s - [[file:%s][%s]]"
                   (format-time-string "%F" date) entry
                   (org-publish-find-title entry project))))
        ((eq style 'tree)
         ;; Return only last subdir.
         (file-name-nondirectory (directory-file-name entry)))
        (t entry)))
```

## RSS feed

RSS-feed generation is done with the ox-rss package, but it requires some additional
customization for my needs.

```elisp
(defun m/org-rss-publish-to-rss (plist filename pub-dir)
  "Publish RSS with PLIST, only when FILENAME is 'rss.org'.
PUB-DIR is when the output will be placed."
  (if (equal "rss.org" (file-name-nondirectory filename))
      (org-rss-publish-to-rss plist filename pub-dir)))

(defun m/format-rss-feed (title list)
  "Generate RSS feed, as a string.
TITLE is the title of the RSS feed.  LIST is an internal
representation for the files to include, as returned by
`org-list-to-lisp'.  PROJECT is the current project."
  (concat "#+TITLE: " title "\n\n"
          (org-list-to-subtree list 1 '(:icount "" :istart ""))))

(defun m/format-rss-feed-entry (entry style project)
  "Format ENTRY for the RSS feed.
ENTRY is a file name.  STYLE is either 'list' or 'tree'.
PROJECT is the current project."
  (cond ((not (directory-name-p entry))
         (let* ((file (org-publish--expand-file-name entry project))
                (title (org-publish-find-title entry project))
                (date (format-time-string "%Y-%m-%d"
                (org-publish-find-date entry project)))
                (link (concat (file-name-sans-extension entry) ".html")))
          (with-temp-buffer
            (insert (format "* %s\n" title))
            (org-set-property "RSS_PERMALINK" link)
            (org-set-property "PUBDATE" date)
            (insert-file-contents file)
            (buffer-string))))
        ((eq style 'tree)
         ;; Return only last subdir.
         (file-name-nondirectory (directory-file-name entry)))
        (t entry)))
```

## Project spec for org-publish

This spec defines the directory structure and exporting options for org-publish

```elisp
(defun m/get-publish-project-spec ()
    "Return project settings for use with `org-publish-project-alist'."
    (let* ((website-root (file-name-as-directory
                          "~/miikanissi.com"))
           (website-org (file-name-as-directory
                         (concat website-root "org")))
           (website-www (file-name-as-directory
                         (concat website-root "www")))
           (website-org-img (file-name-as-directory
                             (concat website-org "img")))
           (website-www-img (file-name-as-directory
                             (concat website-www "img")))
           (website-org-css (file-name-as-directory
                             (concat website-org "css")))
           (website-www-css (file-name-as-directory
                             (concat website-www "css")))
           (website-org-html (file-name-as-directory
                              (concat website-org "html")))
           (website-org-blog (file-name-as-directory
                               (concat website-org "blog")))
           (get-content (lambda (x)
                          (with-temp-buffer
                            (insert-file-contents (concat website-org-html
                                                          x))
                            (buffer-string))))
           (website-html-head (funcall get-content "html_head.html"))
           (website-html-preamble (funcall get-content "html_preamble.html"))
           (website-html-postamble (funcall get-content "html_postamble.html")))
        `(("org"
           :base-directory ,website-org
           :base-extension "org"
           :recursive t
           :exclude "rss\\.org\\|sitemap\\.org"
           :publishing-directory ,website-www
           :publishing-function org-html-publish-to-html
           :author "Miika Nissi"
           :email "miika@miikanissi.com"
           :with-title t
           :description "This is my personal website: a place where you can read and learn about technology related subjects."
           :keywords "Miika Nissi, blog, resume, technology, programming"
           :section-numbers nil
           :headline-levels 4
           :language en
           :with-toc nil
           :with-date t
           :with-email t
           :with-statistics-cookies nil
           :with-todo-keywords nil
           :auto-sitemap t
           :sitemap-sort-files anti-chronologically
           :sitemap-format-entry m/org-publish-org-sitemap-format-entry
           :html-head-include-default-style nil
           :html-head-include-scripts nil
           :htmlized-source t
           :html-doctype "html5"
           :html-html5-fancy t
           :html-head ,website-html-head
           :html-preamble ,website-html-preamble
           :html-postamble ,website-html-postamble)
          ("images"
           :base-directory ,website-org-img
           :base-extension "png\\|jpg\\|gif\\|svg\\|ico"
           :recursive t
           :publishing-directory ,website-www-img
           :publishing-function org-publish-attachment)
          ("css"
           :base-directory ,website-org-css
           :base-extension "css"
           :publishing-directory ,website-www-css
           :publishing-function org-publish-attachment)
          ("rss"
           :base-directory ,website-org
           :base-extension "org"
           :exclude "rss\\.org\\|index\\.org\\|about\\.org\\|sitemap\\.org"
           :recursive t
           :publishing-directory ,website-www
           :publishing-function m/org-rss-publish-to-rss
           :title "Miika's Blog"
           :description "This feed contains blog posts from Miika Nissi. Topics ranging from lifestyle to technology."
           :author "Miika Nissi"
           :html-link-use-abs-url t
           :html-link-home "https://miikanissi.com/"
           :with-broken-link t
           :with-toc nil
           :rss-image-url "https://miikanissi.com/img/favicon.ico"
           :with-date t
           :with-author t
           :creator "Miika Nissi"
           :with-description t
           :auto-sitemap t
           :sitemap-filename "rss.org"
           :sitemap-title "Miika's blog"
           :sitemap-style list
           :sitemap-sort-files anti-chronologically
           :sitemap-function m/format-rss-feed
           :sitemap-format-entry m/format-rss-feed-entry)
          ("miikanissi.com" :components ("org" "images" "css" "rss")))))
```

## Project publishing function

The website is updated when calling `m/publish-website`, which only publishes newly
modified files. When used with additional arguments, a full update can be forced:
`(m/publish-website "miikanissi.com" t)`.

```elisp
(defun m/publish-website (&optional project force)
    "Publish personal website."
    (interactive)
    (unless project (setq project "miikanissi.com"))
    (let ((org-publish-project-alist (m/get-publish-project-spec))
          (org-export-date-timestamp-format "%Y-%m-%d")
          (org-todo-keywords '((sequence "TODO" "REVIEW" "|"
                                         "DONE" "DEFERRED" "ABANDONED"))))
      (org-publish-project project force))
    (templated-html-create-sitemap-xml "~/miikanissi.com/www/sitemap.xml" "~/miikanissi.com/www" "https://miikanissi.com/"))
```

## Afterword

My setup is constantly changing but for now I'm happy with the setup I've built. For the
latest updates you can check my
[GitHub](https://github.com/miikanissi/dotfiles/tree/master/.emacs.d/).
