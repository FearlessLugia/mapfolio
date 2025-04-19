export interface ExpCardItem {
  place: string
  title: string
  location?: string
  date: string
  tags: string[]
  detail?: string[]
}

export const experiences: ExpCardItem[] = [
  {
    place: 'Amazon',
    title: 'Incoming SDE Intern',
    location: 'Toronto, ON',
    date: 'June 2025 - September 2025',
    tags: ['']
  },
  {
    place: 'Ansys',
    title: 'Software Engineer Intern',
    location: 'Toronto, ON',
    date: 'January 2024 - April 2024',
    tags: ['C++', 'gRPC', 'Python', 'Git', 'Azure DevOps']
  },
  {
    place: 'Safran',
    title: 'Software Engineer',
    date: 'April 2021 - April 2024',
    tags: ['C#', 'TypeScript', 'React', 'Node.js', 'Python', 'C++', 'MongoDB', 'MySQL', 'Vue', 'Git']
  },
  {
    place: 'Sony',
    title: 'Electronics Engineer',
    date: 'August 2020 - April 2024',
    tags: ['C#', 'C++']
  },
  {
    place: 'Western Securities Co., Ltd.',
    title: 'Equity Research Intern',
    date: 'April 2019 - July 2019',
    tags: ['']
  }
]

export const experiences2: ExpCardItem[] = [
  {
    place: 'Université Sainte-Anne',
    title: 'French Immersion',
    location: 'Church Point, NS',
    date: 'September 2024 - June 2026',
    tags: ['French'],
    detail: ['Explore Program funded by the Government of Canada']
  },
  {
    place: 'University of Toronto',
    title: 'Master of Engineering, Computer Engineering',
    location: 'Toronto, ON',
    date: 'September 2024 - June 2026',
    tags: ['']
  },
  {
    place: 'Zhejiang University',
    title: 'Bachelor of Engineering, Mechatronics Engineering',
    location: 'Hangzhou, China',
    date: '2016 - 2020',
    tags: ['']
  },
  {
    place: 'École Polytechnique',
    title: 'Exchange',
    location: 'Palaiseau, France',
    date: 'September 2018 - March 2019',
    tags: ['']
  },
  {
    place: 'Georgia Institute of Technology',
    title: 'Summer School',
    location: 'Atlanta, GA',
    date: 'July 2018 - August 2018',
    tags: ['']
  }
]

