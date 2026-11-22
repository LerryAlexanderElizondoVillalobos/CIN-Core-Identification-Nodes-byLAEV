# Module manager

Main will own module discovery, declared dependencies, enablement, lifecycle and status. The migration begins with a registry contract; module execution/loading is intentionally not invented before existing module implementations are inventoried.

Proposed descriptor fields: `module_id`, `version`, `entrypoint`, `dependencies`, `capabilities`, `enabled`, `configuration_schema`.
