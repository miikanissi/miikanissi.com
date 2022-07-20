---
title: "Bachelors Thesis"
date: 2021-11-21T14:40:12-04:00
description:
  "Bachelor's thesis on Odoo (version 14) event management system. Integration with
  dynamic survey creation."
---

For the past year I have been working for a company that specializes in open source
business management software, especially
[Odoo - Open Source ERP and CRM](https://www.odoo.com/). In spring 2021 I was tasked to
research Odoo's (version 14) abilities as an Event Management System for a customer and
what improvements needed to be made. I found three important features that were missing
and together with my employer and the customer we decided that I could use the
development of these features as my Bachelor's thesis.

## The Missing Features and Development

### 1. Canceling Registrations

In the core version of Odoo 14, registrants do not have the ability to cancel their own
registrations - only the event manager could cancel them. This is a big inconvenience as
registrants would need to contact the event manager manually in case of a cancellation.
My solution was to create a portal view for the registrants to manage the state of their
registrations. This portal could be accessed through a unique URL sent with the
registration confirmation email.

Additionally, the event manager could define how long before the event begins the
cancellations are possible. For example, the event manager could choose to close
cancellations when there is less than 24 hours until the event begins.

### 2. Waiting List

It is common for an event management system to have a waiting list if an event is fully
booked. However, Odoo 14 does not have this feature. My solution was to make a
user-friendly way to sign up for a waiting list with an email notification if the event
had more seats available.

The process of joining a waiting list followed the same process as registrations with
the difference that the registrant was not required to make a payment. If the event got
more seats available the waiting list, members would receive an email to confirm their
seat in a first-come first-serve basis. For a paid event this confirmation included
making a payment through the system.

### 3. Questions

Odoo 14 has the ability to ask registrants custom questions in the registration form.
These questions could either be free text questions or drop down selections, but our
customer had a need for more complex registration forms. My solution was to integrate
Odoo's event management with an existing Odoo survey feature. This survey allows a more
customizable way of creating complex forms and with this integration we saved time and
future maintenance cost by not creating a fully custom form creation system and instead
used a pre-existing feature.

## Finishing Touches

I wrote my thesis based on the project after the development process. The thesis is now
published and can be viewed from a permanent address at
[https://urn.fi/URN:NBN:fi:amk-2021111220157](https://urn.fi/URN:NBN:fi:amk-2021111220157).
