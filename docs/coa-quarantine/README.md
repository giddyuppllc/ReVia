# Quarantined certificate — do not return to `public/`

`semaglutide-coa.png` was moved out of `public/` on 2026-09-19. It is kept here,
not deleted: it is a genuine third-party quality record and destroying it would
be the wrong response to what it says.

## What it is

Chromate Certificate of Analysis **#33285**, access code RECODEYX5461, batch
**H.012526**, sample received 03/03/26, analysed 03/18/26, signed Lucas Weber,
Principal Chemist. Client block: AgeREcode. The photographed vial is labelled
**GLP-1SG 5mg**.

## Why it was quarantined

The identity row **fails**:

| Field     | Specification | Result         | Verdict  |
|-----------|---------------|----------------|----------|
| Identity  | Semaglutide   | **Sermorelin** | `!!!`    |
| Quantity  | 5mg           | 5.361mg        | Conforms |
| Purity    | > 98%         | 99.078%        | Conforms |
| Metals    | < 50 ppb      | < 50 ppb       | Conforms |

The material is clean and correctly quantified. It is **not the compound on the
label**. A vial sold as semaglutide contained sermorelin.

The file was reachable at `/coa/semaglutide-coa.png` on every deployment that
carried it, and it was referenced by nothing in `src/` — so it was published
without being linked, and without appearing in any page a reviewer would check.
It sat directly against the site's own claim that a lot which fails does not
ship.

## This is not only a website problem

A failing identity test is a supply-chain fact, not a copy problem. Before any
of these sites take an order for this compound, someone has to establish with
the supplier:

  - whether batch H.012526 material was ever shipped to customers;
  - what is physically in the inventory labelled as this compound today;
  - whether the same batch code on other certificates in `public/coa/` refers to
    the same production run (it appears on several).

## Returning it

Do not move it back. If a passing certificate for this compound is issued,
publish that one. If this batch's history has to be disclosed, that is a
decision for the owner and counsel, not a file move.
