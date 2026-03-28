import type { College, Course } from './types';
import fs from 'fs/promises';
import path from 'path';

// Using require to import JSON for mock data in a server component context
const placeholderData = require('./placeholder-images.json');
const { placeholderImages } = placeholderData;

const collegesFilePath = path.join(process.cwd(), 'src/lib/colleges.json');

export let colleges: College[] = [];

export async function loadColleges() {
    // If colleges are already in memory, don't read the file again
    if (colleges.length > 0) {
        return;
    }
    
    try {
        const data = await fs.readFile(collegesFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        // Dates are stored as strings in JSON, so we need to convert them back to Date objects
        colleges = jsonData.map((college: any) => ({
            ...college,
            createdAt: new Date(college.createdAt),
            updatedAt: new Date(college.updatedAt),
        }));
    } catch (error) {
        console.error('Failed to load colleges data:', error);
        // Fallback to initial data if file doesn't exist or is invalid
        colleges = initialColleges;
    }
}

// Function to save colleges to the JSON file
export async function saveColleges(updatedColleges: College[]) {
    try {
        const data = JSON.stringify(updatedColleges, null, 2);
        await fs.writeFile(collegesFilePath, data, 'utf-8');
        colleges = updatedColleges; // Update the in-memory array
    } catch (error) {
        console.error('Failed to save colleges data:', error);
    }
}

export async function deleteCollege(collegeId: string): Promise<void> {
    await loadColleges();
    const index = colleges.findIndex(college => college.id === collegeId);
    if (index === -1) {
        throw new Error('College not found');
    }
    colleges.splice(index, 1);
    await saveColleges(colleges);
}

export async function createCollege(data: Omit<College, 'id' | 'createdAt' | 'updatedAt'>): Promise<College> {
    await loadColleges();
    const newCollege: College = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
    };
    colleges.push(newCollege);
    await saveColleges(colleges);
    return JSON.parse(JSON.stringify(newCollege));
}

export async function updateCollege(id: string, updatedData: Partial<Omit<College, 'id' | 'createdAt'>>): Promise<College> {
    await loadColleges();
    const index = colleges.findIndex(college => college.id === id);
    if (index === -1) {
        throw new Error('College not found');
    }
    const existingCollege = colleges[index];
    const updatedCollege: College = {
        ...existingCollege,
        ...updatedData,
        id: existingCollege.id,
        createdAt: existingCollege.createdAt,
        updatedAt: new Date(),
    };
    colleges[index] = updatedCollege;
    await saveColleges(colleges);
    return JSON.parse(JSON.stringify(updatedCollege));
}

export async function getColleges(filters: {
  query?: string;
  state?: string;
  city?: string;
  minFees?: number;
  maxFees?: number;
  cutoff?: number;
} = {}): Promise<College[]> {
  await loadColleges();

  let filteredColleges = colleges;

  if (filters.query) {
    const lowerCaseQuery = filters.query.toLowerCase();
    filteredColleges = filteredColleges.filter(college =>
      college.name.toLowerCase().includes(lowerCaseQuery)
    );
  }
  if (filters.state) {
    filteredColleges = filteredColleges.filter(college => college.state === filters.state);
  }
  if (filters.city) {
    filteredColleges = filteredColleges.filter(college => college.city === filters.city);
  }
  if(filters.minFees !== undefined) {
    const minFees = filters.minFees;
    filteredColleges = filteredColleges.filter(college => college.fees >= minFees);
  }
  if(filters.maxFees !== undefined) {
    const maxFees = filters.maxFees;
     filteredColleges = filteredColleges.filter(college => college.fees <= maxFees);
  }
  if (filters.cutoff !== undefined) {
    filteredColleges = filteredColleges
      .map(college => {
        const matchingCourses = college.courses.filter(course => course.cutoff <= filters.cutoff!);
        if (matchingCourses.length > 0) {
          // Return a new college object with only the matching courses
          return { ...college, courses: matchingCourses };
        }
        return null;
      })
      .filter((college): college is College => college !== null);
  }

  return JSON.parse(JSON.stringify(filteredColleges));
}

export async function getCollegeById(id: string): Promise<College | undefined> {
  await loadColleges();
  const college = colleges.find(college => college.id === id);
  return college ? JSON.parse(JSON.stringify(college)) : undefined;
}

export async function getUniqueStates(): Promise<string[]> {
    await loadColleges();
    const states = new Set(colleges.map(c => c.state));
    return Array.from(states).sort();
}

export async function getUniqueCities(state?: string): Promise<string[]> {
    await loadColleges();
    const relevantColleges = state ? colleges.filter(c => c.state === state) : colleges;
    const cities = new Set(relevantColleges.map(c => c.city));
    return Array.from(cities).sort();
}

// This is the initial data that will be used to create the colleges.json file.
const initialCoursesIIT: Course[] = [
    { name: 'Computer Science', cutoff: 99.8 },
    { name: 'Electrical Engineering', cutoff: 99.5 },
    { name: 'Mechanical Engineering', cutoff: 99.2 },
    { name: 'Civil Engineering', cutoff: 98.9 },
    { name: 'Chemical Engineering', cutoff: 98.7 },
    { name: 'Biotechnology', cutoff: 98.5 },
];

const initialCoursesNIFT: Course[] = [
    { name: 'Fashion Design', cutoff: 92 },
    { name: 'Textile Design', cutoff: 89 },
    { name: 'Accessory Design', cutoff: 88 },
    { name: 'Fashion Communication', cutoff: 91 },
    { name: 'Apparel Production', cutoff: 85 },
];

const initialCoursesIIMB: Course[] = [
    { name: 'PGP in Management', cutoff: 99 },
    { name: 'Executive PGP', cutoff: 98 },
    { name: 'PGP in Business Analytics', cutoff: 99.5 },
    { name: 'PhD', cutoff: 95 },
];

const initialCoursesAIIMS: Course[] = [
    { name: 'MBBS', cutoff: 99.9 },
    { name: 'MD/MS', cutoff: 99.5 },
    { name: 'B.Sc Nursing', cutoff: 97 },
    { name: 'M.Sc', cutoff: 96 },
    { name: 'PhD', cutoff: 95 },
];

const initialCoursesNLSIU: Course[] = [
    { name: 'B.A. LL.B. (Hons.)', cutoff: 99.7 },
    { name: 'LL.M.', cutoff: 98 },
    { name: 'Master of Public Policy', cutoff: 97.5 },
    { name: 'PhD in Law', cutoff: 96 },
];

const initialColleges: College[] = [
  {
    id: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    address: 'Hauz Khas',
    city: 'New Delhi',
    state: 'Delhi',
    website: 'https://home.iitd.ac.in/',
    contactNumber: '+91-11-2659-7135',
    email: 'info@iitd.ac.in',
    description: 'A premier public technical and research university located in Hauz Khas, New Delhi, India. It is one of the oldest Indian Institutes of Technology in India.',
    longDescription: 'Established in 1961, IIT Delhi has been declared as an Institute of National Importance. The campus of 325 acres is located in Hauz Khas, south Delhi, with the Qutub Minar and Lotus Temple in its vicinity. The institute offers a wide range of programs in engineering, sciences, and management.',
    courses: initialCoursesIIT,
    fees: 225000,
    awards: [
      {
        title: 'Best Technical University',
        description: 'Awarded by the President of India in 2022.',
        imageUrl: placeholderImages.find((p: any) => p.id === 'award-1').imageUrl,
      },
      {
        title: 'Top Research Institute',
        description: 'Recognized for outstanding contributions to research and innovation.',
        imageUrl: placeholderImages.find((p: any) => p.id === 'award-2').imageUrl,
      }
    ],
    facilities: [
        { name: 'Library', icon: 'Library' },
        { name: 'Hostel', icon: 'BedDouble' },
        { name: 'Gym', icon: 'Dumbbell' },
        { name: 'WiFi', icon: 'Wifi' },
        { name: 'Cafeteria', icon: 'Coffee' },
        { name: 'Sports Complex', icon: 'Trophy' },
    ],
    heroImageUrl: placeholderImages.find((p: any) => p.id === 'college-1-hero').imageUrl,
    galleryImageUrls: [
      placeholderImages.find((p: any) => p.id === 'college-1-gallery-1').imageUrl,
      placeholderImages.find((p: any) => p.id === 'college-1-gallery-2').imageUrl,
      placeholderImages.find((p: any) => p.id === 'college-1-gallery-3').imageUrl,
    ],
    createdAt: new Date('2023-01-15T09:00:00.000Z'),
    updatedAt: new Date('2023-10-20T14:30:00.000Z'),
  },
  {
    id: 'nift-mumbai',
    name: 'National Institute of Fashion Technology, Mumbai',
    address: 'Plot No. 15, Sector 4, Kharghar',
    city: 'Mumbai',
    state: 'Maharashtra',
    website: 'https://nift.ac.in/mumbai',
    contactNumber: '+91-22-2774-7000',
    email: 'info.mumbai@nift.ac.in',
    description: 'A leading institute of fashion education in India, known for its creative and innovative approach.',
    longDescription: 'NIFT Mumbai, established in 1995, has become a hub for fashion education and research in the commercial capital of India. The campus is equipped with state-of-the-art facilities and offers a vibrant environment for students to nurture their creativity.',
    courses: initialCoursesNIFT,
    fees: 280000,
    awards: [
      {
        title: 'Best Fashion Institute',
        description: 'Awarded at the National Education Awards 2021.',
      },
    ],
    facilities: [
      { name: 'Design Studio', icon: 'Paintbrush' },
      { name: 'Resource Center', icon: 'BookOpen' },
      { name: 'Photography Lab', icon: 'Camera' },
      { name: 'Cafeteria', icon: 'Coffee' },
      { name: 'Hostel', icon: 'BedDouble' },
    ],
    heroImageUrl: placeholderImages.find((p: any) => p.id === 'college-2-hero').imageUrl,
    galleryImageUrls: [
      placeholderImages.find((p: any) => p.id === 'college-2-gallery-1').imageUrl,
      placeholderImages.find((p: any) => p.id === 'college-2-gallery-2').imageUrl,
      placeholderImages.find((p: any) => p.id === 'college-2-gallery-3').imageUrl,
    ],
    createdAt: new Date('2023-02-10T11:00:00.000Z'),
    updatedAt: new Date('2023-11-05T18:00:00.000Z'),
  },
  {
    id: 'iim-bangalore',
    name: 'Indian Institute of Management Bangalore',
    address: 'Bannerghatta Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    website: 'https://www.iimb.ac.in/',
    contactNumber: '+91-80-2658-2450',
    email: 'info@iimb.ac.in',
    description: 'A top-ranked business school in India, offering a range of postgraduate and doctoral programs.',
    longDescription: 'IIM Bangalore is an Institute of National Importance, renowned for its academic excellence, research, and leadership development. The beautiful 100-acre campus provides an ideal environment for learning and growth.',
    courses: initialCoursesIIMB,
    fees: 2300000,
    awards: [
      {
        title: '#1 Business School in India',
        description: 'Ranked by NIRF for multiple consecutive years.',
      },
    ],
    facilities: [
      { name: 'Auditorium', icon: 'Projector' },
      { name: 'Financial Markets Lab', icon: 'CandlestickChart' },
      { name: 'Library', icon: 'Library' },
      { name: 'Sports Center', icon: 'Trophy' },
      { name: 'Hostel', icon: 'BedDouble' },
    ],
    heroImageUrl: placeholderImages.find((p: any) => p.id === 'college-3-hero').imageUrl,
    galleryImageUrls: [
      placeholderImages.find((p: any) => p.id === 'college-3-gallery-1').imageUrl,
      placeholderImages.find((p: any) => p.id === 'college-3-gallery-2').imageUrl,
    ],
    createdAt: new Date('2023-03-20T08:30:00.000Z'),
    updatedAt: new Date('2023-09-15T12:00:00.000Z'),
  },
  {
    id: 'aiims-delhi',
    name: 'All India Institute of Medical Sciences, Delhi',
    address: 'Ansari Nagar',
    city: 'New Delhi',
    state: 'Delhi',
    website: 'https://www.aiims.edu/',
    contactNumber: '+91-11-2658-8500',
    email: 'info@aiims.edu',
    description: 'A globally recognized medical college and hospital, AIIMS Delhi is a leader in medical education and healthcare.',
    longDescription: 'AIIMS was established in 1956 as an institution of national importance by an Act of Parliament with the objects to develop patterns of teaching in Undergraduate and Post-graduate Medical Education in all its branches so as to demonstrate a high standard of Medical Education in India.',
    courses: initialCoursesAIIMS,
    fees: 6500,
    awards: [
      {
        title: 'Top Medical College',
        description: 'Consistently ranked as the #1 medical college in India.',
      },
    ],
    facilities: [
      { name: 'Advanced Hospital', icon: 'Hospital' },
      { name: 'Research Labs', icon: 'FlaskConical' },
      { name: 'Medical Library', icon: 'Library' },
      { name: 'Auditorium', icon: 'Projector' },
      { name: 'Hostel', icon: 'BedDouble' },
    ],
    heroImageUrl: placeholderImages.find((p: any) => p.id === 'college-4-hero').imageUrl,
    galleryImageUrls: [],
    createdAt: new Date('2023-04-01T10:00:00.000Z'),
    updatedAt: new Date('2025-10-01T07:19:18.217Z'),
  },
  {
    id: 'nlsiu-bengaluru',
    name: 'National Law School of India University, Bengaluru',
    address: 'Gnana Bharathi Main Rd, Teachers Colony, Nagarbhavi',
    city: 'Bengaluru',
    state: 'Karnataka',
    website: 'https://www.nls.ac.in/',
    contactNumber: '+91-80-2321-3160',
    email: 'registrar@nls.ac.in',
    description: 'The first National Law University established in India and a pioneer in legal education.',
    longDescription: 'Established in 1986, NLSIU has consistently been ranked as the best law school in India. It is known for its rigorous curriculum, distinguished faculty, and for producing leaders in the legal profession.',
    courses: initialCoursesNLSIU,
    fees: 325000,
    awards: [
      {
        title: 'Best Law School in India',
        description: 'Ranked #1 by NIRF for law for several years.',
      },
    ],
    facilities: [
      { name: 'Moot Court Hall', icon: 'Gavel' },
      { name: 'Law Library', icon: 'Library' },
      { name: 'Legal Aid Clinic', icon: 'Scale' },
      { name: 'Hostel', icon: 'BedDouble' },
      { name: 'Sports Facilities', icon: 'Trophy' },
    ],
    heroImageUrl: placeholderImages.find((p: any) => p.id === 'college-5-hero').imageUrl,
    galleryImageUrls: [],
    createdAt: new Date('2023-05-12T14:00:00.000Z'),
    updatedAt: new Date('2023-10-25T11:20:00.000Z'),
  },
];
