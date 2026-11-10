
/* Sample data for the admin dashboard.
   All names and records are fictional. */

const PROGRAMMES = [
    "BSc Computer Science",
    "BSc Mathematics",
    "BSc Information Technology",
    "BEd Science"
];

const DEPARTMENTS = [
    "Computer Science",
    "Mathematics",
    "Information Technology",
    "Education"
];

const STATUSES = [
    "Active",
    "Deferred",
    "Graduated"
];


// Get the time for an activity based on how many minutes ago it happened.
function minutesAgo(n) {
    return new Date(Date.now() - n * 60000).toISOString();
}


// Default sample records
const DEFAULT_DB = {

    students: [
        {
            id: 1,
            regNo: "IN13/00112/25",
            name: "Amos mogaka",
            programme: "BSc Computer Science",
            year: 2,
            status: "Active"
        },
        {
            id: 2,
            regNo: "IN13/00020/25",
            name: "Brian Otieno",
            programme: "BSc Computer Science",
            year: 2,
            status: "Active"
        },
        {
            id: 3,
            regNo: "IN13/00200/25",
            name: "Cynthia Moraa",
            programme: "BSc Mathematics",
            year: 1,
            status: "Active"
        },
        {
            id: 4,
            regNo: "IN13/00130/25",
            name: "Dennis Kiprop",
            programme: "BSc Information Technology",
            year: 3,
            status: "Active"
        },
        {
            id: 5,
            regNo: "IN13/00014/25",
            name: "Esther Nyaboke",
            programme: "BEd Science",
            year: 4,
            status: "Graduated"
        },
        {
            id: 6,
            regNo: "IN13/00113/25",
            name: "Elnah mang'eyi",
            programme: "BSc Computer Science",
            year: 1,
            status: "Active"
        },
        {
            id: 7,
            regNo: "IN13/00009/25",
            name: "Grace Achieng",
            programme: "BSc Mathematics",
            year: 3,
            status: "Deferred"
        },
        {
            id: 8,
            regNo: "IN13/00242/24",
            name: "Hassan Mohamed",
            programme: "BSc Information Technology",
            year: 2,
            status: "Active"
        },
        {
            id: 9,
            regNo: "IN13/00146/25",
            name: "Dancun kipngeno",
            programme: "BSc Computer Science",
            year: 4,
            status: "Graduated"
        },
        {
            id: 10,
            regNo: "IN13/00096/25",
            name: "James Mwangi",
            programme: "BEd Science",
            year: 1,
            status: "Active"
        },
        {
            id: 11,
            regNo: "IN13/00116/25",
            name: "Karen Nyakundi",
            programme: "BSc Mathematics",
            year: 2,
            status: "Active"
        },
        {
            id: 12,
            regNo: "IN13/00050/25",
            name: "Liam Ochieng",
            programme: "BSc Computer Science",
            year: 3,
            status: "Deferred"
        }
    ],


    lecturers: [
        {
            id: 1,
            name: "Dr. Ruth Chweya",
            department: "Computing sciences",
            email: "chweyaruth66@gmail.com"
        },
        {
            id: 2,
            name: "Ms Rebecca Arika",
            department: "Computung sciences",
            email: "arikarebee2@gmail.com"
        },
        {
            id: 3,
            name: "Prof. Sarah Kemei",
            department: "Mathematics",
            email: "sarahs001@gmail.com"
        },
        {
            id: 4,
            name: "Dr. Tom Nyamweya",
            department: "Information Technology",
            email: "tom.nyamweya@gmail.com"
        },
        {
            id: 5,
            name: "Ms. Ruth Gesare",
            department: "Education",
            email: "r.gesare@gmail.com"
        }
    ],


    units: [
        {
            id: 1,
            code: "Comp212",
            name: "system analysis and design",
            department: "Computing sciences",
            credits: 3,
            lecturerId: 1
        },
        {
            id: 2,
            code: "Comp220",
            name: "Data communication and computer networks",
            department: "Computing sciences",
            credits: 3,
            lecturerId: 2
        },
        {
            id: 3,
            code: "Comp112",
            name: "Operating Systems",
            department: "Computing sciences",
            credits: 3,
            lecturerId: 1
        },
        {
            id: 4,
            code: "MATH114",
            name: "Calculus I",
            department: "Mathematics",
            credits: 3,
            lecturerId: 3
        },
        {
            id: 5,
            code: "MATH201",
            name: "Statistics",
            department: "Mathematics",
            credits: 3,
            lecturerId: 3
        },
        {
            id: 6,
            code: "SOEN110",
            name: "Introduction to Databases",
            department: "Information Technology",
            credits: 3,
            lecturerId: 4
        },
        {
            id: 7,
            code: "EDU105",
            name: "Science Teaching Methods",
            department: "Education",
            credits: 2,
            lecturerId: 5
        }
    ],


    activity: [
        {
            text: "Dennis Kiprop was registered for Year 3",
            time: minutesAgo(12)
        },
        {
            text: "Unit STA201 was assigned to Prof. Sarah Kemei",
            time: minutesAgo(95)
        },
        {
            text: "Grace Achieng's status changed to Deferred",
            time: minutesAgo(60 * 5)
        },
        {
            text: "New unit EDU105 was added",
            time: minutesAgo(60 * 26)
        }
    ]

};
