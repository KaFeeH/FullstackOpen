# Countries

Practical exercise from **Full Stack Open** Part 2: Communicating with server.

## Overview

A country information application that fetches data from two external APIs. Users can search and filter countries by name, view detailed information, and check current weather for the capital city.

## Features

### Country search

- Real-time filtering by country name with 1-second debounce
- "Too many matches" warning when results exceed 10
- "Show" button to quickly narrow search to a specific country
- Empty state when no results match

### Country detail

- Basic info: capital, area, languages
- National flag image
- Current weather in the capital: temperature (Celsius), wind speed, weather icon

### API integration

- REST Countries API for country data
- OpenWeatherMap API for weather data
- `countryService` module encapsulates all HTTP requests via Axios

## Components

| Component       | Responsibility                                                            |
| --------------- | ------------------------------------------------------------------------- |
| `App`           | Root component: manages search state, API orchestration, and render logic |
| `SearchInput`   | Controlled input that triggers search on every keystroke                  |
| `ListCountries` | Renders filtered country list with "show" buttons                         |
| `Information`   | Detailed view of a single country with flag, languages, and weather       |

## Tech Stack

- React 19.2.5
- Vite 8.0.10
- React Compiler (Babel plugin)
- ESLint (flat config)
- Axios 1.16.0

## Usage

```bash
pnpm install
pnpm run dev
```

## Environment Variables

Create a `.env` file with:

```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```
