# Governance architecture

The canonical architecture is `docs/design.md`. Planned suite cells are
independent downstream consumers over exact public product revisions:

```text
semantic | replay | compatibility | browser-live | certification
                         |
                         v
                receipt and failure routing
```

The harness may share orchestration and receipt vocabulary. It may not share or
reimplement product authority.
