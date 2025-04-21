# Mapfolio

A full-stack personal portfolio website with an interactive photo map.

Created by: Kiiro Huang (1011781957)

E-mail: kiiro.huang@mail.utoronto.ca

## Video Demo

[![Mapfolio Video Demo](https://img.youtube.com/vi/AoNDha2fcac/maxresdefault.jpg)](https://youtu.be/AoNDha2fcac)

## Motivation

For a Software Development Engineer (SDE), a well-crafted personal portfolio is essential to differentiate myself from
other candidates. Employers increasingly look beyond traditional resumes, seeking clear, interactive demonstrations of
potential capabilities. Recognizing this need, I propose _Mapfolio_, a full-stack personal portfolio website with an
interactive photo map, to showcase my previous experiences, professional skills, and personal interests interactively
and engagingly. Given my extensive travels and photography from all over the world, I specifically would like to
geographically display my photos on a world map.

Creating _Mapfolio_ offers an excellent opportunity to enhance my expertise in a wide range of web development
technologies. This includes implementing fancy visual effects using GSAP to demonstrate advanced
front-end skills, seamless integration with cloud storage services for efficient file management, and robust database
management. Moreover, through direct interaction with widely-used Map APIs, I can build practical experience relevant to
industries such as e-commerce, logistics, food delivery, travel planning, and ride-sharing services.

The primary users of _Mapfolio_ include potential employers, recruiters, and other interested visitors. By integrating
an interactive, geospatial-driven approach, _Mapfolio_ will allow users to explore my photography collection from
various global locations, offering a richer and more immersive experience than conventional portfolio sites.
Furthermore, this project holds broader educational significance. If released as an open-source resource, _Mapfolio_'s
design and architecture can provide valuable insights to others aiming to construct their own personal websites. Users
could adapt and extend the innovative features to create interactive experiences tailored to their specific
requirements.

## Objectives

The primary goal of _Mapfolio_ is to deliver a visually appealing, full-stack personal portfolio platform. At its core,
the site will feature an interactive Earth map to geographically present my photography collection. Users will
intuitively interact with the map to view photographs captured at specific global locations, enhancing the browsing
experience with contextual geographic metadata.

To complement this interactive visual showcase, the portfolio will include essential professional components such as a
landing page, a timeline exhibiting my previous experiences, project highlights, and correspondence to find me.

## Technical Stack

_Mapfolio_ employs **Next.js** for both front-end and back-end development, providing SEO-friendly and responsive
interfaces.
**TypeScript** ensures type safety and maintainability. The visual design uses **Tailwind CSS** and **shadcn/ui**
components, while advanced animations and visual effects are created using **GSAP**.

Data management including photo metadata and user data is handled through **Prisma** ORM with **PostgreSQL** database
hosted by **Supabase**, with images stored securely in **DigitalOcean Spaces**, an **Amazon
S3**-compatible storage service. Built-in **CDN** is used to cache and deliver content closer to users.

Integration with external services like **Mapbox API** will provide interactive map functionalities and geocoding
features. **Better Auth** will be used for user authentication, ensuring secure access to the photo upload feature.

## Features

### Photo Upload and File Storage

Photos will be uploaded via a secure back-end API, handling file uploads and subsequently extract location data (
latitude and longitude) from each photo using the **exifr** library. To enhance user experience, this geographic
information will be translated into readable country and city names through **reverse geocoding** via the Mapbox API.
These photo metadata will be stored in the PostgreSQL database.

Uploaded photos are securely stored in **DigitalOcean Space** to ensure fast and reliable access. No automatic lifecycle
deletion policy will be configured that might automatically delete photos. To optimize storage efficiency and for
simplicity, uploads will be restricted to `JPG`/`JPEG` file formats with a maximum allowed size of 10 MB per photo.

Additionally, smaller-sized **thumbnail** versions of each image will be generated to optimize performance and reduce
load times when viewing multiple images simultaneously on the map interface. Images and thumbnails will each have
distinct public URLs.

#### Design of Data Structure (Photo Metadata)

```prisma
model Photo {
  id                Int         @id @default(autoincrement())
  photoName         String      
  url               String      
  thumbnailUrl      String      
  photoCountry      String?     
  photoCity         String?     
  photoTimestamp    DateTime?   
  uploadedTimestamp DateTime    @default(now())
  status            PhotoStatus @default(Waiting)

  photoLocation Json? @map("photoLocation")
}
```

Since the photo metadata stored in PostgreSQL, **PostGIS** extension is used to store and query geographic data
efficiently. However, prisma does not support PostGIS natively, so `Json` type is applied to store the location
information. Nonetheless, PostGIS can be leveraged to support more advanced features, such as searching for nearby
photos.

### Interactive Map

The interactive map serves as the central feature of the portfolio. Upon loading, it retrieves all photo information
from the database and generates geographical markers accordingly. Users is able to smoothly zoom and pan across the
globe, with location markers dynamically clustering or separating depending on zoom levels. Clicking an individual
marker displays the original photo along with its associated city and country. Clicking a cluster marker opens a dialog
showcasing all photos within that cluster, and clicking a specific photo within the dialog then brings up a detailed
view of the image.

### User Authentication and Authorization

Given the personal nature of this portfolio, photos can only be uploaded by myself. The sign-up page, admin page, and
upload page are only accessible during development. In the production environment, these pages will be routed to a
`not-found` page, and `Upload` and `Admin` button will not appear on Navbar. During development, if the user is not
signed in, the `Upload` and `Admin` button will be hidden from the Navbar, and attempting to access `/upload` will
redirect to the `/admin` page. This setup ensures both secure access and a clean interface for public users.

The back-end will include a secure `sign-up` and `admin` endpoint to authenticate users using **Better Auth**.
Subsequent API requests like photo uploads will verify current session to ensure that only authorized users can access
the service.

### Cost

#### DigitalOcean

DigitalOcean Spaces is a S3-compatible object storage service with built-in CDN. DigitalOcean offers $200 credits for
student through its free tier, although credit card information is required during sign-up.

#### Mapbox API

The project utilizes the Mapbox API for both front-end map rendering and back-end reverse geocoding. Mapbox provides a
free-tier plan sufficient for personal projects, which is adequate to support expected request volumes during
development and initial deployment. Similar to DigitalOcean, signing up for Mapbox API requires credit card information.

#### Deployment

The website is deployed on Vercel, which is the recommended deployment platform for Next.js applications. Deployment is
free of charge. To improve accessibility and memorability, the project also shortens the default `vercel.app` subdomain
link.

### Other Personal Portfolio Features

I also include the following features using **GSAP** to make my portfolio more attractive:

- Landing page
- Interactive experience timeline
- Map preview section
- Project highlights
- Site information and contact section

This portfolio also includes a list of my previous projects along with direct links to my corresponding GitHub
repositories.

### API Design

Besides user authentication and authorization, this system exposes an end-user API endpoint for photo uploading.

#### Photo Upload API

API Endpoint: `POST /api/upload`

Authorization: Session

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

## User Guide

### Home Page

Endpoint: `/`

Home page of _Mapfolio_ features the Landing Page, My Experience Timeline, My Projects, Site Information and Contact Me.

### Gallery Page

Endpoint: `/gallery`

Gallery page displays all uploaded photos.

### Map Page

Endpoint: `/map`

Map page features an interactive map. Clicking an individual marker opens a detailed view of that photo, while clicking
a cluster marker opens a dialog showing all photos from that location.

### Upload Page

Endpoint: `/upload`

Upload page allows the admin to upload photos. This page is only accessible in development mode.

### Admin Page

Endpoint: `/admin`

Admin page is used for signing in and signing out of the system. This page is only accessible in development mode.

### Sign-up Page

Endpoint: `/signup`

Sign-up page is used for registering a new account. This page is only accessible in development mode.

## Development Guide

### Environment setup and configuration

#### Install dependencies

```bash
npm install
```

If you encounter issues during upload (particularly on macOS), it may be due to the `sharp` library. Try deleting the
`node_modules` directory and reinstalling dependencies. See detailed
information [here](https://sharp.pixelplumbing.com/install/) for `sharp` installation.

#### Set up environment

Copy `.env.example` to `.env`.

```bash
cp .env.example .env
```

Update the `.env` file with your own environment variables. The `.env` file should look like this:

```dotenv
DATABASE_URL=your-database-url

SPACES_KEY=your-access-key
SPACES_SECRET=your-secret-key
SPACES_REGION=tor1
SPACES_BUCKET=mapfolio
SPACES_ENDPOINT=https://tor1.digitaloceanspaces.com

MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-access-token

NEXT_PUBLIC_APP_URL=your-public-app-url

BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=your-public-app-url
```

### Database Initialization

`DATABASE_URL` is the connection string for your PostgreSQL database. In this project, I use Supabase as a publicly
accessible hosted database solution. The connection string can be found in the following:

- Go to your Supabase project
- Click on `Connect` on the top navigation bar
- In the `Connection String` Tab, copy the `Session pooler` connection string

### Cloud Storage Configuration

`SPACES_KEY` and `SPACES_SECRET` are the access key and secret key for your DigitalOcean Spaces account. `SPACES_KEY`
refers to the `Access Key ID`, which can be found under `Spaces Object Storage` -> `Settings` Tab. `SPACES_SECRET` is
the `Secret Key` which is only displayed once at the time of creation.

### Mapbox API Configuration

`MAPBOX_ACCESS_TOKEN` and `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` are the access token for your Mapbox account. You can
find it in the dashboard of your Mapbox account. It is located on the right of the page called `Toekns`. The
`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is used in the front-end, while `MAPBOX_ACCESS_TOKEN` is used in the back-end. You can
use the same value for both.

### Better Auth Configuration

`BETTER_AUTH_SECRET` is a random value used by the `Better-Auth` library for encryption and generating hashes. You can
generate one [here](https://www.better-auth.com/docs/installation).

### Local Development

#### Local Environment Variables

If you want to run the project locally, you need to have a `.env.local` file in the root directory with the following
environment variables:

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
```

This will allow you to run the project locally.

#### Run the development server

```bash
npm run dev
```

This command will start the development server on `http://localhost:3000`.

### Credentials for Grading

Detail value has been sent to the instructor by email.

## Deployment Information

### Live URL

https://mapfolio-kiiros.vercel.app/

### Deployment Platform Details

This project is hosted on **Vercel**.

#### Build the project

```bash
npm run build
```

This command will build the project for production. It will create an optimized version of the project in the `.next`
directory.

##### Deploy to Vercel

```bash
npm run deploy
```

This command will deploy the project to Vercel.

If it asks for installing the `vercel` package, just type `y` to proceed.

## Individual Contributions

Kiiro Huang: All

## Lessons Learned and Concluding Remarks

Throughout the development of this project, I acquired valuable insights and significantly enhanced my technical
capabilities. I gained hands-on experience on advanced tech stack to deepen my expertise in modern web frameworks, cloud
services, and database management, ensuring my skills remain relevant and competitive in the industry.

One of the standout benefits of this project is its practical applicability. The final deliverable is fully functional
and immediately ready for inclusion in my professional portfolio, making it highly beneficial for future job
applications and interviews.

Additionally, I put a lot of emphasis on performance optimization to improve user experience and reduce loading time. I
implemented different strategies such as utilizing CDN services, generating optimized image thumbnails, employing
skeleton loaders to enhance perceived performance, and adopting Static Site Generation (SSG) and Client-Side
Generation (CSG) for efficient rendering.