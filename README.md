# Basic Flow-Like UI (Angular)

## Components

### `Class` Train

#### Selectors

- `train,[flow]`

#### Properties

| Name                                                            | Description                                        |
| --------------------------------------------------------------- | -------------------------------------------------- |
| `@Input()` trainData: [Train.Caoches](#Coaches)                 | Data to build each coach                           |
| `@Output('promote')` addNewCoachEvtEmitter: EventEmitter\<any\> | Event Emitted when the `promoter` wheel is clicked |

### `Class` Coach

#### Selectors

- `coach`

#### Properties

| Name                                                                  | Description                                        |
| --------------------------------------------------------------------- | -------------------------------------------------- |
| `@Input()` coachData: [Coach.Data](#Data)                             | Name of the flow being visualized                  |
| `@Output('promote')` promoterWheelClickedEmitter: EventEmitter\<any\> | Event Emitted when the `promoter` wheel is clicked |

### `Class` Wheel

#### Selectors

- `wheel`

#### Properties

| Name                                                                   | Description                                        |
| ---------------------------------------------------------------------- | -------------------------------------------------- |
| `@Input()` wheel: [Coach.Wheel](#Wheel)                                | wheel data                                         |
| `@Output('promote')` newCoachAdderWheelEvtEmitter: EventEmitter\<any\> | Event Emitted when the `promoter` wheel is clicked |

### **TypeDefinition**

### Namespace: `Coach`

#### Wheel

```typescript
interface Wheel {
  icon?: string;
  descriptionPanel?: ComponentType<unknown>;
  promoter?: boolean;
}
```

#### Data

- Dependancies
  - [Titles](#Titles)
  - [Description](#Description)

```typescript
interface Data {
  titles?: Titles;
  description?: Description;
  wheels?: Array<Wheel>;
  lastCoach?: boolean;
}
```

#### Titles

```typescript
type Titles = Record<string, string>;
```

#### Description

```typescript
type Description = null | Record<string, string>;
```

### Namespace `Train`

#### Caoches

- Dependancies
  - [Coach.Data](#Data)

```typescript
type Caoches = Array<Coach.Data>;
```
