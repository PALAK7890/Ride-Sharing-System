
# ER Diagram - Ride Sharing System

```mermaid
erDiagram
    RIDERS ||--o{ TRIPS : "books"
    DRIVERS ||--o{ TRIPS : "drives"

    RIDERS {
        int id PK
        string name
    }

    DRIVERS {
        int id PK
        string name
        boolean is_accepting_rider
    }

    TRIPS {
        string id PK
        int rider_id FK "NOT NULL"
        int driver_id FK "NOT NULL"
        int origin "NOT NULL"
        int destination "NOT NULL"
        int seats "NOT NULL"
        float fare "NOT NULL"
        string status "NOT NULL"
        timestamptz created_at "DEFAULT NOW()"
        timestamptz updated_at "DEFAULT NOW()"
    }
```

## Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| Rider → Trip | One-to-Many | A rider can book multiple trips |
| Driver → Trip | One-to-Many | A driver can serve multiple trips |

## Relationship Semantics

- `TRIPS` has total participation in both relationships because `rider_id` and `driver_id` are `NOT NULL`
- `RIDERS` has partial participation because a rider may exist without any trips
- `DRIVERS` has partial participation because a driver may exist without any trips

## Indexes Created By Schema

- `idx_trips_rider_id` on `trips(rider_id)`
- `idx_trips_driver_id` on `trips(driver_id)`
- `idx_trips_status` on `trips(status)`

