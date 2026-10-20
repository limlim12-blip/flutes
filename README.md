# Flutes 

Flutes is a Go-based web application and background worker service designed to curate, index, and stream metadata for movie torrents. 
It bridges the gap between raw torrent data and rich movie metadata, providing a clean, searchable interface.

> **SECURITY NOTICE: PLEASE USE A VPN**
> Curating and indexing torrent data exposes your IP address to the DHT network and trackers. It is highly recommended to route this application through a VPN.
> Please configure your VPN settings inside the `docker-compose.yml` file before starting the application.

## Features

- **Metadata Curation:** Automatically matches raw torrent hashes/names with TMDB movie metadata.
- **Background Workers:** Asynchronous processing for robust indexing and crawling.
- **Modern UI:** Built with Go, Templ, and Tailwind CSS for a fast, server-side rendered frontend.
- **Someday must have feature (DHT Auto-Listener):** Automatically listen to the DHT network for new torrents in real-time.

## Prerequisites & Datasets (must have for crawler to work)
1. **TMDB Movie Dataset**
   * File: `TMDB_movie_dataset_v11.csv`
   * Source: [Kaggle - TMDB Movies Dataset 2023 (930k+ Movies)](https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies)
   
2. **Torrents Dataset**
   * File: `Torrents.csv`
   * Source: [Codeberg - torrents-csv-data](https://codeberg.org/heretic/torrents-csv-data)
-  Its a pain to automate this into setup, so... Get those and put them into `./stuff` (`./stuff/Torrents.csv`, `./stuff/TMDB_movie_dataset_v11.csv`)  with `./` is project's root.
## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/limlim12-blip/flutes.git
   cd flutes
   ```
2. **Configure Environment and Settings:**
    - Copy the example configuration files and update them with your API keys and parameters:
    ```bash 
    cp .env.example .env
    cp config.yml.example config.yml
    ```
    - Open .env and set your TMDB_API_KEY, VPN PROVIDER, and WIREGUARD_PRIVATE_KEY.
    - Open config.yml to adjust database, HTTP server, Redis, and torrent memory parameters if needed.

3. **Start the infrastructure:**
   ```bash
   make u
   ```
etc. ***utils command***
  ```bash
  make u # start the app
  make d # stop the app
  make l # inspect the logs
  make backup # backup database
  #! to start/stop crawling metadata worker, it need a post requset: 
  # Note: Replace `8080` and the exact route path with your server's configured port if different
  curl -X POST http://localhost:8080/api/v1/crawler/start # start the crawler
  curl -X POST http://localhost:8080/api/v1/crawler/stop # stop the crawler
  ```

