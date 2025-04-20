export interface ExpCardItem {
  place: string
  title: string
  location?: string
  date: string
  startYear: number
  startMonth?: number
  endYear: number
  endMonth?: number
  tags: string[]
  detail?: string[]
  direction: ExpCardDirection
}

export enum ExpCardDirection {
  Left = 'left',
  Right = 'right'
}

export const workExp: ExpCardItem[] = [
  {
    place: 'Amazon',
    title: 'Incoming SDE Intern',
    location: 'Toronto, ON',
    date: 'June 2025 - September 2025',
    startYear: 2025,
    startMonth: 6,
    endYear: 2025,
    endMonth: 9,
    tags: [''],
    direction: ExpCardDirection.Right
  },
  {
    place: 'Ansys',
    title: 'Software Engineer Intern',
    location: 'Toronto, ON',
    date: 'January 2025 - April 2025',
    startYear: 2025,
    startMonth: 1,
    endYear: 2025,
    endMonth: 4,
    tags: ['C++', 'gRPC', 'Python', 'Git', 'Azure DevOps'],
    direction: ExpCardDirection.Right
  },
  {
    place: 'Safran',
    title: 'Software Engineer',
    date: 'April 2021 - April 2024',
    startYear: 2021,
    startMonth: 4,
    endYear: 2024,
    endMonth: 4,
    tags: ['C#', 'TypeScript', 'React', 'Node.js', 'Python', 'C++', 'MongoDB', 'MySQL', 'Vue', 'Git'],
    direction: ExpCardDirection.Right
  },
  {
    place: 'Sony',
    title: 'Electronics Engineer',
    date: 'August 2020 - April 2021',
    startYear: 2020,
    startMonth: 8,
    endYear: 2021,
    endMonth: 4,
    tags: ['C#', 'C++'],
    direction: ExpCardDirection.Right
  },
  {
    place: 'Western Securities Co., Ltd.',
    title: 'Equity Research Intern',
    date: 'April 2019 - July 2019',
    startYear: 2019,
    startMonth: 4,
    endYear: 2019,
    endMonth: 7,
    tags: [''],
    direction: ExpCardDirection.Right
  }
]

export const eduExp: ExpCardItem[] = [
  {
    place: 'Université Sainte-Anne',
    title: 'French Immersion',
    location: 'Church Point, NS',
    date: 'May 2025 - June 2025',
    startYear: 2025,
    startMonth: 5,
    endYear: 2025,
    endMonth: 6,
    tags: ['French'],
    detail: ['Explore Program funded by the Government of Canada'],
    direction: ExpCardDirection.Right
  },
  {
    place: 'University of Toronto',
    title: 'Master of Engineering, Computer Engineering',
    location: 'Toronto, ON',
    date: 'September 2024 - June 2026',
    startYear: 2024,
    startMonth: 9,
    endYear: 2025,
    endMonth: 10,
    tags: [''],
    direction: ExpCardDirection.Left
  },
  {
    place: 'Zhejiang University',
    title: 'Bachelor of Engineering, Mechatronics Engineering',
    location: 'Hangzhou, China',
    date: '2016 - 2020',
    startYear: 2016,
    startMonth: 9,
    endYear: 2020,
    endMonth: 6,
    tags: [''],
    direction: ExpCardDirection.Left
  },
  {
    place: 'École Polytechnique',
    title: 'Exchange',
    location: 'Palaiseau, France',
    date: 'September 2018 - March 2019',
    startYear: 2018,
    startMonth: 9,
    endYear: 2019,
    endMonth: 3,
    tags: [''],
    direction: ExpCardDirection.Right
  },
  {
    place: 'Georgia Institute of Technology',
    title: 'Summer School',
    location: 'Atlanta, GA',
    date: 'July 2018 - August 2018',
    startYear: 2018,
    startMonth: 7,
    endYear: 2018,
    endMonth: 8,
    tags: [''],
    direction: ExpCardDirection.Right
  }
]
