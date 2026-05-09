import w1 from "@/assets/worker-1.jpg";
import w2 from "@/assets/worker-2.jpg";
import w3 from "@/assets/worker-3.jpg";

export type Professional = {
  id: string;
  name: string;
  trade: string;
  category: "Electricians" | "Carpenters" | "Plumbers" | "Teachers" | "Doctors";
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
    about: "Dedicated and certified electrician with experience in electrical installation, maintenance, troubleshooting, and repair work. Skilled in handling residential, commercial, and industrial electrical systems while following safety standards and delivering reliable solutions.",
    phone: "+92 XXX XXX XXXX", email: "ahmadali@email.com", location: "Gujranwala, Punjab, Pakistan",
    education: "Diploma / Technical Training in Electrical Work",
    educationDetail: "Professional technical training focused on electrical systems, installation, and maintenance",
    languages: ["English", "Urdu"] },
  { id: "m-nauman", name: "M. Nauman", trade: "Electrician", category: "Electricians", rating: 5, photo: w2,
    about: "Experienced electrician specializing in modern wiring, smart home installations, and safety inspections.",
    phone: "+92 XXX XXX XXXX", email: "nauman@email.com", location: "Lahore, Punjab, Pakistan",
    education: "Diploma in Electrical Engineering",
    educationDetail: "Advanced training in industrial and residential electrical systems.",
    languages: ["English", "Urdu", "Punjabi"] },
  { id: "nadeem-ali", name: "Nadeem Ali", trade: "Electrician", category: "Electricians", rating: 4, photo: w3,
    about: "Reliable electrician with 8+ years of hands-on experience in commercial and residential projects.",
    phone: "+92 XXX XXX XXXX", email: "nadeem@email.com", location: "Islamabad, Pakistan",
    education: "Technical Certification in Electrical Work",
    educationDetail: "Certified by national vocational training authority.",
    languages: ["English", "Urdu"] },
  { id: "imran-khan", name: "Imran Khan", trade: "Carpenter", category: "Carpenters", rating: 5, photo: w2,
    about: "Master carpenter crafting custom furniture, doors and cabinets with precision finishing.",
    phone: "+92 XXX XXX XXXX", email: "imran@email.com", location: "Karachi, Pakistan",
    education: "Apprenticeship in Fine Woodworking",
    educationDetail: "10+ years of carpentry workshop experience.",
    languages: ["Urdu", "English"] },
  { id: "yousaf", name: "Yousaf Malik", trade: "Carpenter", category: "Carpenters", rating: 4, photo: w1,
    about: "Skilled finish carpenter for kitchens, wardrobes and on-site installations.",
    phone: "+92 XXX XXX XXXX", email: "yousaf@email.com", location: "Faisalabad, Pakistan",
    education: "Vocational Training in Carpentry",
    educationDetail: "Certified woodwork specialist.",
    languages: ["Urdu"] },
  { id: "salman", name: "Salman Tariq", trade: "Carpenter", category: "Carpenters", rating: 4, photo: w3,
    about: "Custom furniture maker focused on durable, hand-finished pieces.",
    phone: "+92 XXX XXX XXXX", email: "salman@email.com", location: "Multan, Pakistan",
    education: "Trade school graduate",
    educationDetail: "Specialized in joinery and cabinetry.",
    languages: ["Urdu", "Punjabi"] },
];

export const categories = ["Electricians", "Carpenters", "Plumbers", "Teachers", "Doctors"] as const;
