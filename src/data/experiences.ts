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
  isLarge: boolean
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
    startYear: 7,
    startMonth: 5,
    endYear: 7,
    endMonth: 9,
    tags: [''],
    direction: ExpCardDirection.Right,
    isLarge: false
  },
  {
    place: 'Ansys',
    title: 'Software Engineer Intern',
    location: 'Toronto, ON',
    date: 'January 2025 - April 2025',
    startYear: 6,
    startMonth: 12,
    endYear: 7,
    endMonth: 4,
    tags: ['C++', 'gRPC', 'Python', 'Git', 'Azure DevOps'],
    detail: [
      'Refactored and modernized the existing C++ API under HFSS for inter-process communication and scripting access using gRPC, enabling a seamless shift from a Windows-specific interface towards a web-based microservices architecture, while preserving full backward compatibility.',
      'Developed and debugged within a large-scale codebase of a flagship commercial industrial software, gaining hands-on experience with complex system architecture and legacy system integration.',
      'Conducted an in-depth analysis of specific modules and provided technical insights for potential enhancements and forward development.',
      'Authored Python scripts to invoke the refactored methods, ensuring change consistency and contributing to automated regression testing.'
    ],
    direction: ExpCardDirection.Right,
    isLarge: false
  },
  {
    place: 'Safran',
    title: 'Software Engineer',
    date: 'April 2021 - April 2024',
    startYear: 4,
    startMonth: 4,
    endYear: 6,
    endMonth: 5,
    tags: ['C#', 'TypeScript', 'React', 'Node.js', 'Python', 'C++', 'MongoDB', 'MySQL', 'Vue', 'Git'],
    detail: [
      'Led team of 2 for front-end development of various engineering and manufacturing data management systems using React, TypeScript and Vue.',
      'Developed software tools in C# and C++, including CATIA extended development, to apply, check, and compare 3D models, significantly streamlining the design process and reducing lead times.',
      'Created visual, interactive outputs by building graphs from diverse sources to handle extensive structured and unstructured data generated from different stages of the design life cycle, ensuring improved deliverable quality, consistency with design changes, and data integrity.',
      'Awarded the 2023 Star of the company. Achieved "Exceeds Expectations" appraisals (4/4) for both 2021 and 2022. Secured 3 software copyrights.'
    ],
    direction: ExpCardDirection.Right,
    isLarge: false
  },
  {
    place: 'Sony',
    title: 'Electronics Engineer',
    date: 'August 2020 - April 2021',
    startYear: 3,
    startMonth: 8,
    endYear: 4,
    endMonth: 4,
    tags: ['C#', 'C++'],
    direction: ExpCardDirection.Right,
    isLarge: false
  },
  {
    place: 'Western Securities Co., Ltd.',
    title: 'Equity Research Intern',
    date: 'April 2019 - July 2019',
    startYear: 2,
    startMonth: 9,
    endYear: 3,
    endMonth: 1,
    tags: [''],
    direction: ExpCardDirection.Right,
    isLarge: false
  }
]

export const eduExp: ExpCardItem[] = [
  {
    place: 'Université Sainte-Anne',
    title: 'French Immersion',
    location: 'Church Point, NS',
    date: 'May 2025 - June 2025',
    startYear: 7,
    startMonth: 4,
    endYear: 7,
    endMonth: 6,
    tags: ['French'],
    detail: ['Explore Program funded by the Government of Canada'],
    direction: ExpCardDirection.Left,
    isLarge: true
  },
  {
    place: 'University of Toronto',
    title: 'Master of Engineering, Computer Engineering',
    location: 'Toronto, ON',
    date: 'September 2024 - June 2026',
    startYear: 6,
    startMonth: 9,
    endYear: 7,
    endMonth: 11,
    tags: ['Distributed System', 'Database System'],
    direction: ExpCardDirection.Left,
    isLarge: false
  },
  {
    place: 'Zhejiang University',
    title: 'Bachelor of Engineering, Mechatronics Engineering',
    location: 'Hangzhou, China',
    date: '2016 - 2020',
    startYear: 1,
    startMonth: 10,
    endYear: 3,
    endMonth: 7,
    tags: [''],
    direction: ExpCardDirection.Left,
    isLarge: false
  },
  {
    place: 'École Polytechnique',
    title: 'Exchange',
    location: 'Palaiseau, France',
    date: 'September 2018 - March 2019',
    startYear: 2,
    startMonth: 2,
    endYear: 2,
    endMonth: 9,
    tags: [''],
    direction: ExpCardDirection.Left,
    isLarge: true
  },
  {
    place: 'Georgia Institute of Technology',
    title: 'Summer School',
    location: 'Atlanta, GA',
    date: 'July 2018 - August 2018',
    startYear: 1,
    startMonth: 12,
    endYear: 2,
    endMonth: 2,
    tags: [''],
    direction: ExpCardDirection.Left,
    isLarge: true
  }
]


export const lifeExp: ExpCardItem[] = [
  {
    place: 'Moved to Canada',
    title: '',
    location: 'Toronto, ON',
    date: 'July 2024',
    startYear: 6,
    startMonth: 6,
    endYear: 6,
    endMonth: 8,
    tags: [''],
    direction: ExpCardDirection.Left,
    isLarge: false
  },
  {
    place: 'Received Immigrant Visa to Canada',
    title: '',
    location: '',
    date: 'November 2023',
    startYear: 5,
    startMonth: 12,
    endYear: 6,
    endMonth: 2,
    tags: [''],
    direction: ExpCardDirection.Left,
    isLarge: false
  }
]