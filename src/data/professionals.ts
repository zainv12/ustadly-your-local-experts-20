import w1 from "@/assets/worker-1.jpg";
import w2 from "@/assets/worker-2.jpg";
import w3 from "@/assets/worker-3.jpg";

export type Category =
  | "Electricians" | "Carpenters" | "Plumbers" | "Teachers" | "Doctors"
  | "Painters" | "Mechanics" | "AC Technicians" | "Welders" | "Masons"
  | "Cleaners" | "Drivers" | "Gardeners" | "Beauticians" | "Cooks"
  | "Tailors" | "IT Support" | "Movers" | "Tutors" | "Nurses";

export type Professional = {
  id: string;
  name: string;
  trade: string;
  category: Category;
  rating: number;
  photo: string;
  about: string;
  phone: string;
  email: string;
  location: string;
  education: string;
  educationDetail: string;
  languages: string[];
};

export const professionals: Professional[] = [
  { id: "ahmad-ali", name: "Ahmad Ali", trade: "Electrician", category: "Electricians", rating: 4, photo: w1,
    about: "Dedicated and certified electrician with experience in installation, maintenance and troubleshooting.",
    phone: "+92 XXX XXX XXXX", email: "ahmadali@email.com", location: "Gujranwala, Pakistan",
    education: "Diploma in Electrical Work", educationDetail: "Technical training in installation and maintenance",
    languages: ["English", "Urdu"] },
  { id: "m-nauman", name: "M. Nauman", trade: "Electrician", category: "Electricians", rating: 5, photo: w2,
    about: "Specializes in modern wiring, smart home installations, and safety inspections.",
    phone: "+92 XXX XXX XXXX", email: "nauman@email.com", location: "Lahore, Pakistan",
    education: "Diploma in Electrical Engineering", educationDetail: "Industrial and residential systems.",
    languages: ["English", "Urdu", "Punjabi"] },
  { id: "nadeem-ali", name: "Nadeem Ali", trade: "Electrician", category: "Electricians", rating: 4, photo: w3,
    about: "8+ years experience in commercial and residential projects.",
    phone: "+92 XXX XXX XXXX", email: "nadeem@email.com", location: "Islamabad, Pakistan",
    education: "Technical Certification", educationDetail: "Certified by national vocational authority.",
    languages: ["English", "Urdu"] },
  { id: "imran-khan", name: "Imran Khan", trade: "Carpenter", category: "Carpenters", rating: 5, photo: w2,
    about: "Custom furniture, doors and cabinets with precision finishing.",
    phone: "+92 XXX XXX XXXX", email: "imran@email.com", location: "Karachi, Pakistan",
    education: "Apprenticeship in Fine Woodworking", educationDetail: "10+ years workshop experience.",
    languages: ["Urdu", "English"] },
  { id: "yousaf", name: "Yousaf Malik", trade: "Carpenter", category: "Carpenters", rating: 4, photo: w1,
    about: "Finish carpenter for kitchens, wardrobes and on-site installations.",
    phone: "+92 XXX XXX XXXX", email: "yousaf@email.com", location: "Faisalabad, Pakistan",
    education: "Vocational Training", educationDetail: "Certified woodwork specialist.",
    languages: ["Urdu"] },
  { id: "salman", name: "Salman Tariq", trade: "Carpenter", category: "Carpenters", rating: 4, photo: w3,
    about: "Custom furniture maker focused on durable, hand-finished pieces.",
    phone: "+92 XXX XXX XXXX", email: "salman@email.com", location: "Multan, Pakistan",
    education: "Trade school graduate", educationDetail: "Joinery and cabinetry.",
    languages: ["Urdu", "Punjabi"] },
  { id: "bilal-plumb", name: "Bilal Hussain", trade: "Plumber", category: "Plumbers", rating: 5, photo: w1,
    about: "Pipe fitting, leak repair, water tanks and bathroom installations.",
    phone: "+92 XXX XXX XXXX", email: "bilal@email.com", location: "Rawalpindi, Pakistan",
    education: "Plumbing Certification", educationDetail: "TEVTA certified plumber.",
    languages: ["Urdu", "English"] },
  { id: "asif-plumb", name: "Asif Raza", trade: "Plumber", category: "Plumbers", rating: 4, photo: w3,
    about: "Emergency leak fixes and full bathroom renovations.",
    phone: "+92 XXX XXX XXXX", email: "asif@email.com", location: "Peshawar, Pakistan",
    education: "Vocational Plumbing Diploma", educationDetail: "5+ years field experience.",
    languages: ["Urdu", "Pashto"] },
  { id: "sara-teach", name: "Sara Iqbal", trade: "Math Teacher", category: "Teachers", rating: 5, photo: w2,
    about: "Math and physics tutor for O/A levels with 7 years tutoring experience.",
    phone: "+92 XXX XXX XXXX", email: "sara@email.com", location: "Lahore, Pakistan",
    education: "MSc Mathematics", educationDetail: "Punjab University.",
    languages: ["English", "Urdu"] },
  { id: "hamza-teach", name: "Hamza Sheikh", trade: "English Teacher", category: "Teachers", rating: 4, photo: w1,
    about: "IELTS and spoken English coach.",
    phone: "+92 XXX XXX XXXX", email: "hamza@email.com", location: "Islamabad, Pakistan",
    education: "MA English Literature", educationDetail: "Certified IELTS trainer.",
    languages: ["English", "Urdu"] },
  { id: "dr-ayesha", name: "Dr. Ayesha Khan", trade: "General Physician", category: "Doctors", rating: 5, photo: w2,
    about: "Family medicine, home consultations available.",
    phone: "+92 XXX XXX XXXX", email: "ayesha@email.com", location: "Karachi, Pakistan",
    education: "MBBS, Aga Khan University", educationDetail: "5 years clinical practice.",
    languages: ["English", "Urdu"] },
  { id: "dr-usman", name: "Dr. Usman Tariq", trade: "Pediatrician", category: "Doctors", rating: 5, photo: w3,
    about: "Pediatric care for newborns and children up to 14.",
    phone: "+92 XXX XXX XXXX", email: "usman@email.com", location: "Lahore, Pakistan",
    education: "MBBS, FCPS Pediatrics", educationDetail: "10+ years experience.",
    languages: ["English", "Urdu"] },
];

export const categories: Category[] = [
  "Electricians", "Carpenters", "Plumbers", "Teachers", "Doctors",
  "Painters", "Mechanics", "AC Technicians", "Welders", "Masons",
  "Cleaners", "Drivers", "Gardeners", "Beauticians", "Cooks",
  "Tailors", "IT Support", "Movers", "Tutors", "Nurses",
];
