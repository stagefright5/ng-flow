# Console App Deployment Status UI

## Components

### `Class` Coach

#### Selectors

- `coach`

#### Properties

| Name                                        | Description                                                 |
| ------------------------------------------- | ----------------------------------------------------------- |
| `@Input()` trainName: string                | Name of the flow being visualized                           |
| `@Input()` wheels: Array<[Wheel](#Wheel)>   | Wheel and its associated icon and `descriptionPanel`        |
| `@Output()` promote: EventEmitter\<string\> | Event ('promoted') Emitted when the the `coach` is promoted |

### `Class` Train

#### Selectors

- `train`

#### Properties

| Name                                                      | Description              |
| --------------------------------------------------------- | ------------------------ |
| `@Input()` coachDataArray: Array<[CoachData](#CoachData)> | Data to build each coach |

### TypeDefinition

#### Wheel

```typescript
interface Wheel {
  icon: string;
  descriptionPanel: ComponentClass;
}
```

#### CoachData

- Dependancies
  - [Titles](#Titles)
  - [Description](#Description)

```typescript
interface CoachData {
  titles: Titles;
  description: Description;
}
```

#### Titles

```typescript
type Titles = Array<Record<string, string>>;
```

#### Description

```typescript
type Description = Record<string, string>;
```
