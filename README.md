# Mapfolio

A full-stack personal portfolio website with an interactive photo map.

Created by: Kiiro Huang (1011781957)

E-mail: kiiro.huang@mail.utoronto.ca

## Motivation

For a Software Development Engineer (SDE), a well-crafted personal portfolio is essential to differentiate myself from
other candidates. Employers increasingly look beyond traditional resumes, seeking clear, interactive demonstrations of
potential capabilities. Recognizing this need, I propose _Mapfolio_, a full-stack personal portfolio website with an
interactive photo map, to showcase my previous experiences, professional skills, and personal interests interactively
and engagingly. Given my extensive travels and photography from all over the world, I specifically would like to
geographically display my photos on a world map.

Creating _Mapfolio_ offers an excellent opportunity to enhance my expertise in a wide range of web development
technologies. This includes implementing sophisticated 3D visual effects using Three.js to demonstrate advanced
front-end skills, seamless integration with cloud storage services for efficient file management, and robust database
management. Moreover, through direct interaction with widely-used Map APIs, I can build practical experience relevant to
industries such as e-commerce, logistics, food delivery, travel planning, and ride-sharing services.
react three fiber

The primary users of _Mapfolio_ include potential employers, recruiters, and other interested visitors. By integrating an
interactive, geospatial-driven approach, _Mapfolio_ will allow users to explore my photography collection from various
global locations, offering a richer and more immersive experience than conventional portfolio sites. Furthermore, this
project holds broader educational significance. If released as an open-source resource, _Mapfolio_'s design and
architecture can provide valuable insights to others aiming to construct their own personal websites. Users could adapt
and extend the innovative features to create interactive experiences tailored to their specific requirements.

## Objectives

The primary goal of _Mapfolio_ is to deliver a visually appealing, full-stack personal portfolio platform. At its core,
the site will feature an interactive Earth map to geographically present my photography collection. Users will
intuitively interact with the map to view photographs captured at specific global locations, enhancing the browsing
experience with contextual geographic metadata.

To complement this interactive visual showcase, the portfolio will include essential professional components such as a
landing page, a resume section, a 3D timeline exhibiting my previous experiences, and a contact form for potential
employers.

## Technical Stack

To meet these objectives, the project will employ **Next.js** as a full-stack solution due to its SEO-friendly features.
**TypeScript** will be used for both front-end and back-end development to ensure type safety and consistency. Usage of
**Tailwind CSS** and **shadcn/ui** will ensure a responsive frontend.

Supabase
Data management including photo metadata and user data will be handled through a **PostgreSQL** database, combined with
**Prisma** ORM. **Amazon S3** is selected for image storage, as it provides cloud-based reliability and scalability.
DigitalOcean Spaces is a S3-compatible object storage service with built-in CDN.
CDN is used to cache and deliver content closer to users.

Integration with external services like **Mapbox API** will provide basic map and geographic data. **Three.js**
will be used as client components to add fancy 3D effects for the world map, landing page, and personal timeline.

## Features

### Photo Upload and File Storage

Photos will be uploaded via a secure back-end API, handling file uploads using the **multer** library, and subsequently
extract location data (latitude and longitude) from each photo using the **exifr** library. To enhance user
experience, this geographic information will be translated into readable country and city names through **reverse
geocoding** via the Mapbox API. These photo metadata will be stored in a PostgreSQL database.

Photos will be stored securely in **Amazon Simple Storage Service** (Amazon S3) to ensure fast and reliable access.
I will create a bucket and apply the **Standard Storage Class** to store photos. Also, no automatic lifecycle deletion
policy will be configured that might automatically delete photos.

To optimize storage efficiency and for simplicity, uploads will be restricted to JPG/JPEG file formats with a maximum
allowed size of 2 MB, slightly above the typical size of approximately 1.5 MB per photo.

Additionally, smaller-sized **thumbnail** versions of each image will be generated to optimize performance and reduce
load times when viewing multiple images simultaneously on the map interface. Images and thumbnails will each have
distinct public URLs.

#### Design of Data Structure (Photo Metadata)

- ID: Integer
- Photo Name: String
- S3 URL: String
- S3 Thumbnail URL: String
- Photo Location Latitude: Double
- Photo Location Longitude: Double
- Photo Country: String
- Photo City: String
- Photo Timestamp: Timestamp
- Uploaded Timestamp: Timestamp

Since the photo metadata stored in PostgreSQL, PostGIS extension may be used to store and query geographic data
efficiently. Use Supabase to manage the PostgreSQL database, which is a cloud-based service that provides a fully
managed
PostgreSQL database with built-in support for PostGIS. This will allow me to easily store and query geographic data
using SQL queries, without having to set up and manage the database myself.

### User Authentication

Given the personal nature of this portfolio, photos will only be uploaded by myself. Instead of a publicly accessible
sign-up page, I will manually create a user account directly in the PostgreSQL database, with a password hashed securely
before storage. The back-end will include a secure sign-in endpoint to authenticate users using **JSON Web Token (JWT)**
and **cookie-session**. Subsequent API requests such as photo uploads will verify this token to ensure that only
authorized users can access the service.

#### Design of Data Structure (User)

- ID: Integer
- Username: String
- Password: String

### Interactive Map

The interactive map will serve as the central feature of the portfolio. When loading, it will extract all the location
information from the database and generate geographical markers. Users will be able to smoothly zoom and pan across the
globe, with location markers dynamically clustering or separating depending on zoom levels. Each marker, upon selection,
will display a thumbnail preview and basic metadata such as city, country, and capture date, providing context before
the user views the complete collection.

### Cost

#### DigitalOcean

DigitalOcean Spaces is a S3-compatible object storage service with built-in CDN. The free tier

DigitalOcean offers $200 credits for student, but also required credit card information when signing up.

[//]: # (#### Amazon Web Service &#40;AWS&#41;)

[//]: # (For a new signup AWS account, S3's free tier offers a 12-month free trial that provides 5GB of Amazon S3 storage in the)

[//]: # (S3 Standard storage class; 20,000 GET Requests; 2,000 PUT, COPY, POST, or LIST Requests; and 100 GB of Data Transfer)

[//]: # (Out each month. Signing up for AWS requires credit card information.)

[//]: # ()

[//]: # (Given that each photo will typically be around 1.5 MB, with a strict size limit of 2 MB per upload, I estimate storing)

[//]: # (approximately 500 files totaling around 1 GB of storage capacity, along with their thumbnails, adding roughly 50 MB of)

[//]: # (additional storage, which is well within the free tier limits.)

#### Mapbox API

The project will utilize the Mapbox API for both front-end (interactive map rendering) and back-end processes (reverse
geocoding). Mapbox provides a free-tier plan sufficient for personal projects, which is adequate to support expected
request volumes during development and initial deployment. Signing up for Mapbox API requires credit card information.

### Deployment (Optional)

The website will be deployed on Vercel for both back-end and front-end, which is the recommended deployment platform for
Next.js applications. In order to be a free solution, back-end will adopt the serverless option. For the domain name, I
will use my GitHub io page. Front-end can also be deployed on Amazon S3 static website hosting.

### Other Personal Portfolio Features (Optional)

I will also try to include the following features using Three.js to make my portfolio more attractive:

- Landing Page
- 3D Personal Timeline

This will also include the ordering of my previous GitHub projects and links to my GitHub repositories.

### API Design

This system exposes two end-user API endpoints:

- Photo Upload
- User Sign-in

Several internal APIs will be used to support the front-end map display and interactive features:

- Map
- Map Interactive
- Photo

#### Photo Upload API

API Endpoint: `POST /api/upload`

Authorization: Cookie

##### Upload API Workflow

1. User uploads photo in front-end and calls the back-end API.
2. Back-end extracts location information from the photo and stores it in the database, with placeholders in properties
   of `Url` and `ThumbnailUrl`.
3. Back-end uploads the photo to Amazon S3.
4. Back-end generates the thumbnail and uploads to Amazon S3.
5. Back-end updates the photo metadata with `Url` and `ThumbnailUrl`.
6. Back-end returns the photo metadata as the response.

##### Request Body

- files (array of form data): The photo files to be uploaded.

##### Response

```json
{
  "dbRecords": [
    {
      "id": 1,
      "photoName": "1.JPG",
      "url": "https://mapfolio.tor1.cdn.digitaloceanspaces.com/uploads/1744500664095-1.jpg",
      "thumbnailUrl": "https://mapfolio.tor1.cdn.digitaloceanspaces.com/uploads/thumbnails/1744500665733-1.jpg",
      "photoCountry": "Australia",
      "photoCity": "New South Wales",
      "photoTimestamp": "2016-08-04T21:10:11.000Z",
      "uploadedTimestamp": "2025-04-12T23:31:04.092Z",
      "status": "uploaded",
      "photoLocation": {
        "latitude": -33.853081,
        "longitude": 151.205506
      }
    },
    {
      "id": 2,
      "photoName": "2.jpg",
      "url": "https://mapfolio.tor1.cdn.digitaloceanspaces.com/uploads/1744500665923-2.jpg",
      "thumbnailUrl": "https://mapfolio.tor1.cdn.digitaloceanspaces.com/uploads/thumbnails/1744500666641-2.jpg",
      "photoCountry": "France",
      "photoCity": "Paris",
      "photoTimestamp": "2019-01-28T22:13:22.000Z",
      "uploadedTimestamp": "2025-04-12T23:31:05.922Z",
      "status": "uploaded",
      "photoLocation": {
        "latitude": 48.862228,
        "longitude": 2.288392
      }
    }
  ]
}
```

#### User Sign-in API

Endpoint: `POST /api/signin`

##### Request Body

```json
{
  "username": "kiiro",
  "password": "password"
}
```

##### Response Body

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RAYS5jbSIsImlkIjo0LCJpYXQiOjE3NDIxNzcwMTZ9.4flop1KklsTZrFlhUokg0onZWgIhME2GtkU-i3N7hbg",
  "username": "kiiro"
}
```

##### Response Cookies

| **Name** | **Value**        | **Domain** | **Path** | **Expires** | **HttpOnly** | **Secure** |
|----------|------------------|------------|----------|-------------|--------------|------------|
| session  | eyJqd3QiOiJle... | localhost  | /        | Session     | true         | false      |

#### Map API

Endpoint: `GET /api/map`

##### Map API Workflow

1. Front-end requests the map API.
2. Back-end retrieves all the location information from PostgreSQL database.
3. Back-end returns the location information to the front-end.
4. Front-end displays the map with the location information.
5. Front-end displays the first photo of each location on the map.

Request Body: None

##### Response

```json
{
  "locations": [
    {
      "latitude": 43.653225,
      "longitude": -79.383186,
      "photoUrl": "https://s3.amazonaws.com/bucket/photo1-thumbnail.jpg",
      "city": "Toronto",
      "country": "Canada",
      "photoCount": 5
    }
  ]
}
```

#### Map Interactive API

Endpoint: `GET /api/map?latitude={latitude}&longitude={longitude}`

##### Map Interactive API Workflow

1. User clicks on a marker on the map.
2. Front-end requests the map interactive API with the latitude and longitude.
3. Back-end retrieves all the photos taken at that location from the database.
4. Back-end returns the photos to the front-end.
5. Front-end displays the photos taken at that location.

##### Query Parameters

- latitude (Double)
- longitude (Double)

##### Response

```json
{
  "photos": [
    {
      "photoUrl": "https://s3.amazonaws.com/bucket/photo1.jpg",
      "thumbnailUrl": "https://s3.amazonaws.com/bucket/photo1-thumbnail.jpg",
      "photoTimestamp": "2021-09-01T12:00:00Z"
    }
  ],
  "location": {
    "city": "Toronto",
    "country": "Canada"
  }
}
```

#### Photo API

Endpoint: `GET /api/photos/{photoId}`

##### Photo API Workflow

1. User clicks on a photo.
2. Front-end requests the photo API with the photo ID.
3. Back-end retrieves the photo information from the database.
4. Back-end returns the photo information to the front-end.
5. Front-end displays the photo and the full photo.

##### Query Parameters

- photoId (Integer)

##### Response

```json
{
  "id": 1,
  "photoName": "photo1.jpg",
  "s3Url": "https://s3.amazonaws.com/bucket/photo1.jpg",
  "s3ThumbnailUrl": "https://s3.amazonaws.com/bucket/photo1-thumbnail.jpg",
  "photoLocationLatitude": 43.653225,
  "photoLocationLongitude": -79.383186,
  "photoCountry": "Canada",
  "photoCity": "Toronto",
  "photoTimestamp": "2021-09-01T12:00:00Z",
  "uploadedTimestamp": "2025-03-01T12:00:00Z"
}
```

## User Guide

### Home Page

Endpoint: `/`

Home page of _Mapfolio_.

### Gallery Page

Endpoint: `/gallery`

Gallery Page shows all the photos, even if they don't contain location information.

### Map Page

Endpoint: `/map`

Map Page has an interactive map.

Clicking on an individual photo will refer to the detail dialog of the whole image, while clicking on a cluster will
refer to the dialog containing all the photos in this location.

### Upload Page

Endpoint: `/upload

Admin can upload photos on Upload Page.

`

## Development Guide

Install dependencies

```bash
npm install
```

Set up environment

```bash
# Copy .env.example to .env
cp .env.example .env
```

Update the `.env` using `Credentials for Grading`.

### Credentials for Grading

```dotenv
DATABASE_URL=your-database-url

SPACES_KEY=your-access-key
SPACES_SECRET=your-secret-key
SPACES_REGION=tor1
SPACES_BUCKET=mapfolio
SPACES_ENDPOINT=https://tor1.digitaloceanspaces.com

MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
```

```bash
npm run dev
```

## Deployment Information

vercel

## Individual Contributions

Kiiro Huang: All

## Lessons Learned and Concluding Remarks

Advanced Tech Stack

Performance: Thumbnails, Cache
