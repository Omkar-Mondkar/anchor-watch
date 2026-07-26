## ADDED Requirements

### Requirement: Pluggable Collection
The agent SHALL support dynamic loading of collector plugins, executing them in isolation.

#### Scenario: Running registered collectors
- **WHEN** the agent collector loop runs
- **THEN** it executes every registered plugin and merges their outputs into a single raw dictionary

### Requirement: Data Normalization
The agent SHALL normalize raw collection data into a predictable, deterministic JSON structure.

#### Scenario: Normalizing nested dictionaries
- **WHEN** a plugin returns nested data
- **THEN** the normalizer flattens the data and alphabetizes keys so the resulting JSON string is deterministic
