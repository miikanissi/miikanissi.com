---
title: "Understanding the Unix Philosophy"
description:
  "Miika Nissi's interpretation on Unix philosophy and what it means. Write programs
  that do one thing and connect them with a universal text interface."
date: 2022-10-22T00:19:51-04:00
---

The Unix philosophy originated in the early days of
[Unix](https://en.wikipedia.org/wiki/Unix) as a set of rules and approaches to
desigining a simple yet capable operating system. The point of the philosophy has
evolved over the years and has often been misunderstood to simply mean writing small
programs or dividing a program into small modules/functions. In this post I will try to
explain what Unix philosophy is and present practical reasons to follow it.

> “This is the Unix philosophy: Write programs that do one thing and do it well. Write
> programs to work together. Write programs to handle text streams, because that is a
> universal interface.” - Doug McIlroy

The above is a summarized version of the Unix philosophy by Doug McIlroy, the inventor
of [Unix pipes](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>) and one of the founders
of the Unix tradition.

## Write Programs That Do One Thing and Do It Well

Perhaps the most widely understood part of the Unix philosophy is writing small programs
that each do one thing. The purpose of this is to avoid large monolithic structures
which will eventually become hard to maintain as they grow larger and software
requirements change. By creating programs that do one thing makes it easier in the
future to change parts of them or replace a program with a different one as requirements
change.

This is usually where most people's understanding of Unix philosophy stops and they end
up missing the rest of the picture which is just as important.

## Write Programs to Work Together

Now that we have these small programs each doing a single task we need to be able to
connect them to each other in order to solve real life applications. This is where Unix
pipes come into play. Unix pipes are a simple communication method between programs that
allows them to receive a text input from one program and output a new text output which
can then be used by something else. In a way each program acts as a filter — They take
an input, modify it, and then outputs the result.

Unix pipes are not the only way for programs to communicate with each other but the
important part is the principle of connecting programs with a simple interface and thus
making each program interchangeable.

Notice how in the original definition the output of a program should be a text stream —
not JSON, or XML, or any other structured data format. By using a universal text
interface each program does not need their own parser to parse different data inputs.
Personally, I have nothing against these structured data formats but this is something
to consider when creating a new program. Does it need a complicated data format or could
it simply output text streams?

## Unix Philosophy in Practice

The following is a trivial example showcasing the Unix philosophy in Bash using Unix
pipes:

```bash
curl -s https://en.wikipedia.org/wiki/Unix_philosophy | \
grep "This is the Unix philosophy:" | \
sed -e 's/<[^>]*>//g' | \
sed 's/$/ - Doug McIlroy/' | \
cowsay -f tux
```

Which results in the following output:

```
 ________________________________________
/ This is the Unix philosophy: Write     \
| programs that do one thing and do it   |
| well. Write programs to work together. |
| Write programs to handle text streams, |
| because that is a universal interface. |
\ - Doug McIlroy                         /
 ----------------------------------------
   \
    \
        .--.
       |o_o |
       |:_/ |
      //   \ \
     (|     | )
    /'\_   _/`\
    \___)=(___/

```

Here we are combining four different programs in order to complete a trivial task in a
way that the creators of these programs might have never imagined they were going to be
used for.

First we use the curl program to transfer the desired html page from Wikipedia. Next we
use grep program on the output to get the line containing "This is the Unix
philosophy:". Then in order to clean the html tags we use the sed program to parse and
remove the tags. We then use sed again to append an extra bit of text at the end of the
output. Finally we use a cool program called cowsay to create an ASCII art speech bubble
of the sentence.

The point I would like to highlight with this example is how we were able to complete a
specialized task without having to create a new specific program to do so. We got text
from a web page, parsed it and then transformed it into ASCII art by utilizing programs
which each do one simple task — and it took just a few lines of Bash script to achieve.

## Conclusion

To conclude Unix philosophy is about writing lots of programs that do one thing well and
having those programs connect with a simple text based communication via inputs and
outputs. Although it can be applied to these, Unix philosophy is not about
microservices, APIs, object-oriented programming, or any other modern buzzword.

If you disagree with my interpretation on the Unix philosphy or have any other thoughts
regarding it I would like to hear from you. I can be reached via email at
[miika@miikanissi.com](miika@miikanissi.com).
