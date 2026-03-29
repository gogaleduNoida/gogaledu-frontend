// db/spcourses.js

/**
 * ================================================================
 * SELF-PACED COURSES DATABASE — GogalEdu Academy
 * ================================================================
 * HOW TO ADD A NEW COURSE:
 *  1. Copy the entire "advance-excel" object below
 *  2. Paste it as a new key using the URL slug as key
 *     e.g. "python-basics": { ... }
 *  3. Update all fields: title, pricing, curriculum, etc.
 *  4. Place course image in:   /public/course/your-image.jpg
 *  5. Place video files in:    /public/videos/your-video.mp4
 *  6. Place project files in:  /public/projects/your-file.pdf
 * ================================================================
 *
 * QUIZ ANSWER FORMAT:
 *   answer: 0  → first option (index 0)
 *   answer: 1  → second option (index 1)
 *   answer: 2  → third option (index 2)
 *   answer: 3  → fourth option (index 3)
 *   IMPORTANT: The answer index is NEVER shown to students in the UI.
 *              It is only used server-side to calculate scores.
 *
 * ADDING PROJECTS:
 *   Add more objects to the projects[] array.
 *   The admin can also add projects dynamically via the admin UI
 *   in ProjectsSection (set isAdmin flag in localStorage).
 *
 * VIDEO DURATION:
 *   All videos are marked as 60 seconds (durationSeconds: 60).
 *   A student must watch the full 60 seconds (wall-clock time)
 *   to mark a lesson as completed. Scrubbing / seeking does NOT count.
 * ================================================================
 */

export const spcourses = {

  // ================================================================
  // COURSE: ADVANCED EXCEL
  // URL: /courses/self-paced/advance-excel
  // Total: 10 Modules | 70+ Lessons | 3 Free Preview Videos
  // ================================================================
  "advance-excel": {

    slug: "advance-excel",

    // ── HERO ──────────────────────────────────────────────────────
    hero: {
      title: "Advance Excel",
      subtitle:
        "Master Excel from basics to advanced dashboards, automation and real-world data analysis. Build 5 industry-level projects, earn a Microsoft Certified Certificate, and qualify for a 100% course fee refund.",

      // TAGS: Pill badges shown above title (max 4)
      tags: [
        { label: "Beginner to Advanced", icon: "target" },
        { label: "Self-Paced",           icon: "clock"  },
        { label: "Online",               icon: "online" },
        { label: "Microsoft Certified",  icon: "award"  }
      ],

      // STATS: Shown in the 4 stat cards
      stats: {
        rating:    "4.7",
        students:  "400+",
        projects:  "5",
        guarantee: "100%"
      },

      // PRICING: Right-side enroll card
      pricing: {
        price:         "5999",   // Original (shown with strikethrough)
        discountPrice: "2999",   // Final price (shown in green)
        discount:      "50% OFF" // Badge on course image
      },

      // COURSE IMAGE: /public/course/filename.jpg
      image: "/course/excel.jpg"
    },

    // ── INSTRUCTOR ────────────────────────────────────────────────
    instructor: {
      name:       "Rahul Sharma",
      title:      "Microsoft Excel Trainer & Certified Data Analyst",
      experience: "10+ Years Industry Experience"
      // avatar: "/instructors/rahul.jpg"  ← optional photo
    },

    // ── COURSE FEATURE BADGES ─────────────────────────────────────
    // NOTE: lifetimeAccess is intentionally NOT included here.
    // The certificate and mobile badges are shown in the hero section.
    details: {
      certificate:           true,   // Microsoft Certified Certificate shown
      lifetimeAccess:        false,  // Do NOT show "Lifetime Access" anywhere
      downloadableResources: false,
      mobileAccess:          true
    },

    // ── REQUIREMENTS ──────────────────────────────────────────────
    // Each string = one prerequisite item shown in Overview tab
    requirements: [
      "Basic computer knowledge",
      "Microsoft Excel 2016 or later (Office 365 recommended)",
      "Laptop or desktop computer",
      "No prior Excel experience needed — we start from scratch"
    ],

    // ── TOOLS USED ────────────────────────────────────────────────
    // Each string = one tool badge shown in Overview tab
    tools: [
      "Microsoft Excel",
      "Pivot Tables",
      "Power Query",
      "Power Pivot",
      "Excel Charts & Dashboards",
      "Macros & VBA Basics",
      "XLOOKUP / INDEX-MATCH",
      "LAMBDA & LET Functions"
    ],

    // ── OVERVIEW CARDS ────────────────────────────────────────────
    // Each string = one card in the Overview tab grid (3-column layout)
    // ADD more strings to add more cards — they auto-layout
    overview: [
      "Master 70+ Excel functions — from SUM to LAMBDA",
      "Build professional Sales, HR and Finance dashboards",
      "Clean and transform messy real-world data with Power Query",
      "Automate repetitive tasks with Macros and VBA basics",
      "Create dynamic Pivot Tables with slicers and timelines",
      "Use XLOOKUP, INDEX+MATCH and ARRAY formulas like a pro",
      "Design KPI dashboards for Sales, HR and Operations teams",
      "Complete 5 real-world industry-level projects for your portfolio",
      "Earn a Microsoft Certified Excel Certificate on completion",
      "Get 100% of your course fee refunded upon full completion"
      // ↓ ADD MORE OVERVIEW POINTS HERE
    ],

    // ══════════════════════════════════════════════════════════════
    // CURRICULUM
    //
    // STRUCTURE: Free Preview (index 0) + 9 Content Modules (1–9)
    //
    // LOCKING RULES (auto-handled by page.jsx):
    //   • Free Preview lessons (first 3 globally) are always unlocked
    //   • Lesson N+1 unlocks when Lesson N is fully watched (60s actual time)
    //   • Module N+1 first lesson unlocks after Module N quiz is passed (≥60%)
    //   • If previous module has no quiz, lesson unlocks after last lesson watched
    //
    // VIDEO FILES: Place in /public/videos/filename.mp4
    //   → Update the `video` field in each lesson to your actual file path
    //
    // ADDING MODULES: Copy a module block, paste after the last module
    // ADDING LESSONS: Copy a lesson object, paste inside the `lessons` array
    // ADDING QUESTIONS: Copy a question object, paste inside `quiz` array
    // ══════════════════════════════════════════════════════════════
    curriculum: [

      // ─────────────────────────────────────────────────────────────
      // FREE PREVIEW SECTION (always unlocked — no quiz required)
      // These 3 lessons are shown first and are free for all users.
      // Marked with "Free Preview" badge in the UI.
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Free Preview Lessons",
        moduleDescription: "Watch these 3 free lessons before enrolling. No login required.",
        isFreePreview:     true,  // Flag used by UI to show "Free Preview" badge
        // No quiz for the free preview section

        lessons: [
          {
            // Free Video 1: Introduction to Excel + Interface Tour
            lessonTitle:     "Introduction to Excel & Interface Tour",
            durationSeconds: 60,
            video:           "/videos/excel-intro.mp4", // ← YOUR VIDEO PATH
            preview:         true  // Marks this as publicly visible
          },
          {
            // Free Video 2: Basic Formulas & AutoFill Explained
            lessonTitle:     "Basic Formulas & AutoFill Explained",
            durationSeconds: 60,
            video:           "/videos/excel-free-2.mp4", // ← YOUR VIDEO PATH
            preview:         true
          },
          {
            // Free Video 3: Introduction to Pivot Tables
            lessonTitle:     "Introduction to Pivot Tables",
            durationSeconds: 60,
            video:           "/videos/excel-free-3.mp4", // ← YOUR VIDEO PATH
            preview:         true
          }
        ]
        // NOTE: No `quiz` field here — free preview has no quiz.
        // The first lesson of Module 1 unlocks once all free preview
        // lessons are watched (since no quiz gates the next module).
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 1: Excel Fundamentals
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 1: Excel Fundamentals",
        moduleDescription: "Learn the Excel interface, data types, formatting and file management.",

        lessons: [
          { lessonTitle: "What is Excel & Real-World Use-Cases",                 durationSeconds: 60, video: "/videos/excel-m1-l1.mp4", preview: false },
          { lessonTitle: "Excel Interface Tour — Ribbon, Tabs, Quick Access Toolbar", durationSeconds: 60, video: "/videos/excel-m1-l2.mp4", preview: false },
          { lessonTitle: "Workbook vs Worksheet",                                durationSeconds: 60, video: "/videos/excel-m1-l3.mp4", preview: false },
          { lessonTitle: "Cells, Rows, Columns and Ranges",                      durationSeconds: 60, video: "/videos/excel-m1-l4.mp4", preview: false },
          { lessonTitle: "Data Types — Number, Text, Date, Boolean",             durationSeconds: 60, video: "/videos/excel-m1-l5.mp4", preview: false },
          { lessonTitle: "Saving, AutoSave and Version History",                 durationSeconds: 60, video: "/videos/excel-m1-l6.mp4", preview: false },
          { lessonTitle: "Basic Formatting — Bold, Alignment, Colors",           durationSeconds: 60, video: "/videos/excel-m1-l7.mp4", preview: false },
          { lessonTitle: "Copy, Paste and Paste Special (Values, Formats)",      durationSeconds: 60, video: "/videos/excel-m1-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 1 LESSONS HERE
        ],

        // Module 1 Quiz — Pass ≥60% to unlock Module 2
        // ADMIN: Update questions and answers as needed
        // STUDENTS: Cannot see the `answer` field in the UI
        quiz: [
          {
            question: "What is the basic building block of an Excel spreadsheet?",
            options:  ["Sheet", "Cell", "Row", "Workbook"],
            answer:   1  // "Cell"
          },
          {
            question: "Which tab in the Ribbon contains formatting options like Bold and Font Color?",
            options:  ["Insert", "View", "Home", "Data"],
            answer:   2  // "Home"
          },
          {
            question: "Which keyboard shortcut saves an Excel file?",
            options:  ["Ctrl + P", "Ctrl + S", "Ctrl + Z", "Ctrl + C"],
            answer:   1  // "Ctrl + S"
          },
          {
            question: "What does 'Paste Special → Values' do?",
            options:  [
              "Pastes the cell with all formats and formulas",
              "Pastes only the visible text or number, no formulas",
              "Pastes formatting only",
              "Deletes the source cell"
            ],
            answer:   1  // "Pastes only the visible text..."
          }
          // ↓ ADD MORE MODULE 1 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 2: Essential Formulas & Functions
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 2: Essential Formulas & Functions",
        moduleDescription: "Master cell references, arithmetic formulas and common Excel functions.",

        lessons: [
          { lessonTitle: "What Are Formulas? How Excel Calculates",             durationSeconds: 60, video: "/videos/excel-m2-l1.mp4", preview: false },
          { lessonTitle: "Cell Referencing — Absolute, Relative and Mixed",     durationSeconds: 60, video: "/videos/excel-m2-l2.mp4", preview: false },
          { lessonTitle: "SUM, AVERAGE, MIN and MAX Functions",                  durationSeconds: 60, video: "/videos/excel-m2-l3.mp4", preview: false },
          { lessonTitle: "AutoFill and Flash Fill",                              durationSeconds: 60, video: "/videos/excel-m2-l4.mp4", preview: false },
          { lessonTitle: "COUNT, COUNTA and COUNTBLANK",                         durationSeconds: 60, video: "/videos/excel-m2-l5.mp4", preview: false },
          { lessonTitle: "Text Formulas — LEFT, RIGHT, MID, CONCAT",            durationSeconds: 60, video: "/videos/excel-m2-l6.mp4", preview: false },
          { lessonTitle: "Date Formulas — TODAY, NOW and DATEDIF",              durationSeconds: 60, video: "/videos/excel-m2-l7.mp4", preview: false },
          { lessonTitle: "Basic Error Handling with IFERROR",                   durationSeconds: 60, video: "/videos/excel-m2-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 2 LESSONS HERE
        ],

        quiz: [
          {
            question: "What does the $ sign do in a cell reference like $A$1?",
            options:  [
              "Makes the cell reference relative",
              "Locks the reference so it doesn't change when copied",
              "Adds currency formatting",
              "Multiplies the value by 100"
            ],
            answer:   1  // "Locks the reference..."
          },
          {
            question: "Which function counts only cells that contain numbers?",
            options:  ["COUNTA", "COUNTBLANK", "COUNT", "SUM"],
            answer:   2  // "COUNT"
          },
          {
            question: "What does =LEFT(\"Excel\", 2) return?",
            options:  ["Ex", "ce", "el", "Excel"],
            answer:   0  // "Ex"
          },
          {
            question: "The IFERROR function is used to:",
            options:  [
              "Find errors in your data",
              "Delete error cells",
              "Replace an error with a custom value or message",
              "Fix formula syntax automatically"
            ],
            answer:   2  // "Replace an error..."
          }
          // ↓ ADD MORE MODULE 2 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 3: Data Cleaning & Data Preparation
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 3: Data Cleaning & Data Preparation",
        moduleDescription: "Clean messy datasets, remove duplicates and prepare data for analysis.",

        lessons: [
          { lessonTitle: "Removing Duplicates",                                  durationSeconds: 60, video: "/videos/excel-m3-l1.mp4", preview: false },
          { lessonTitle: "TRIM, CLEAN, SUBSTITUTE and Find & Replace",           durationSeconds: 60, video: "/videos/excel-m3-l2.mp4", preview: false },
          { lessonTitle: "Data Validation and Dropdown Lists",                   durationSeconds: 60, video: "/videos/excel-m3-l3.mp4", preview: false },
          { lessonTitle: "Sorting and Filtering Data",                           durationSeconds: 60, video: "/videos/excel-m3-l4.mp4", preview: false },
          { lessonTitle: "Text-to-Columns",                                      durationSeconds: 60, video: "/videos/excel-m3-l5.mp4", preview: false },
          { lessonTitle: "Remove Blank Rows and Formatting Cleanup",             durationSeconds: 60, video: "/videos/excel-m3-l6.mp4", preview: false },
          { lessonTitle: "Power Query Introduction",                             durationSeconds: 60, video: "/videos/excel-m3-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 3 LESSONS HERE
        ],

        quiz: [
          {
            question: "Which Excel feature automatically splits text like 'John,Doe' into separate columns?",
            options:  ["Flash Fill", "Sort A-Z", "Text-to-Columns", "SUBSTITUTE"],
            answer:   2  // "Text-to-Columns"
          },
          {
            question: "The TRIM function removes:",
            options:  [
              "All spaces inside a text string",
              "Leading, trailing and extra spaces between words",
              "Numbers from a text string",
              "Special characters only"
            ],
            answer:   1  // "Leading, trailing and extra spaces..."
          },
          {
            question: "Data Validation is used to:",
            options:  [
              "Format cells with colors",
              "Restrict what a user can enter into a cell",
              "Protect the entire workbook",
              "Count unique values"
            ],
            answer:   1  // "Restrict what a user can enter..."
          }
          // ↓ ADD MORE MODULE 3 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 4: Intermediate Excel Formulas
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 4: Intermediate Excel Formulas",
        moduleDescription: "Master IF logic, lookup functions and advanced formula techniques.",

        lessons: [
          { lessonTitle: "IF Condition — Real Business Scenarios",               durationSeconds: 60, video: "/videos/excel-m4-l1.mp4", preview: false },
          { lessonTitle: "Nested IF Statements",                                  durationSeconds: 60, video: "/videos/excel-m4-l2.mp4", preview: false },
          { lessonTitle: "AND / OR Logic in Formulas",                           durationSeconds: 60, video: "/videos/excel-m4-l3.mp4", preview: false },
          { lessonTitle: "VLOOKUP — Employee, Sales and Inventory Examples",     durationSeconds: 60, video: "/videos/excel-m4-l4.mp4", preview: false },
          { lessonTitle: "HLOOKUP",                                               durationSeconds: 60, video: "/videos/excel-m4-l5.mp4", preview: false },
          { lessonTitle: "XLOOKUP — Modern Excel Lookup",                        durationSeconds: 60, video: "/videos/excel-m4-l6.mp4", preview: false },
          { lessonTitle: "INDEX + MATCH — The Bonus Master Method",              durationSeconds: 60, video: "/videos/excel-m4-l7.mp4", preview: false },
          { lessonTitle: "Lookup Errors and Troubleshooting",                    durationSeconds: 60, video: "/videos/excel-m4-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 4 LESSONS HERE
        ],

        quiz: [
          {
            question: "What does =IF(A1>100, \"High\", \"Low\") return when A1 = 50?",
            options:  ["High", "Low", "Error", "TRUE"],
            answer:   1  // "Low"
          },
          {
            question: "VLOOKUP searches for a value in which direction?",
            options:  ["Right to left", "Left to right (first column only)", "Any column", "Bottom to top"],
            answer:   1  // "Left to right (first column only)"
          },
          {
            question: "What advantage does XLOOKUP have over VLOOKUP?",
            options:  [
              "It works only in Excel 2007",
              "It can look left and right and returns #N/A by default",
              "It can search in any direction and supports a custom not-found value",
              "It is faster than VLOOKUP for small datasets"
            ],
            answer:   2  // "It can search in any direction..."
          },
          {
            question: "Which formula combination is considered the most flexible lookup method?",
            options:  ["SUM + IF", "VLOOKUP + IFERROR", "INDEX + MATCH", "HLOOKUP + AND"],
            answer:   2  // "INDEX + MATCH"
          }
          // ↓ ADD MORE MODULE 4 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 5: Pivot Tables & Pivot Charts
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 5: Pivot Tables & Pivot Charts",
        moduleDescription: "Summarize and visualize large datasets with Pivot Tables and Pivot Charts.",

        lessons: [
          { lessonTitle: "What are Pivot Tables?",                               durationSeconds: 60, video: "/videos/excel-m5-l1.mp4", preview: false },
          { lessonTitle: "Creating Your First Pivot Table",                      durationSeconds: 60, video: "/videos/excel-m5-l2.mp4", preview: false },
          { lessonTitle: "Pivot Table Calculations — Sum, Count, Average",       durationSeconds: 60, video: "/videos/excel-m5-l3.mp4", preview: false },
          { lessonTitle: "Slicers and Timeline Filters",                         durationSeconds: 60, video: "/videos/excel-m5-l4.mp4", preview: false },
          { lessonTitle: "Pivot Charts",                                          durationSeconds: 60, video: "/videos/excel-m5-l5.mp4", preview: false },
          { lessonTitle: "Grouping Data — Dates, Numbers and Categories",        durationSeconds: 60, video: "/videos/excel-m5-l6.mp4", preview: false },
          { lessonTitle: "Real Use Cases — Sales, HR and Operations",            durationSeconds: 60, video: "/videos/excel-m5-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 5 LESSONS HERE
        ],

        quiz: [
          {
            question: "Pivot Tables are primarily used for:",
            options:  [
              "Creating charts from scratch",
              "Summarizing and analyzing large datasets quickly",
              "Writing complex formulas",
              "Drawing shapes and diagrams"
            ],
            answer:   1  // "Summarizing and analyzing..."
          },
          {
            question: "What does a Slicer do in a Pivot Table?",
            options:  [
              "Cuts unnecessary rows from the data",
              "Adds a visual filter button to filter Pivot Table data interactively",
              "Slices the workbook into multiple sheets",
              "Formats the Pivot Table colors"
            ],
            answer:   1  // "Adds a visual filter button..."
          },
          {
            question: "Which field area in a Pivot Table determines what is calculated (e.g. Sum of Sales)?",
            options:  ["Rows", "Columns", "Filters", "Values"],
            answer:   3  // "Values"
          }
          // ↓ ADD MORE MODULE 5 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 6: Advanced Excel Functions
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 6: Advanced Excel Functions",
        moduleDescription: "Use SUMIF, COUNTIF, ARRAY, LET and LAMBDA for professional analysis.",

        lessons: [
          { lessonTitle: "SUMIF and SUMIFS",                                     durationSeconds: 60, video: "/videos/excel-m6-l1.mp4", preview: false },
          { lessonTitle: "COUNTIF and COUNTIFS",                                 durationSeconds: 60, video: "/videos/excel-m6-l2.mp4", preview: false },
          { lessonTitle: "Advanced Text Functions — LEN, TEXT, VALUE",           durationSeconds: 60, video: "/videos/excel-m6-l3.mp4", preview: false },
          { lessonTitle: "Advanced Date Functions",                               durationSeconds: 60, video: "/videos/excel-m6-l4.mp4", preview: false },
          { lessonTitle: "Logical + Lookup Combined Formulas",                   durationSeconds: 60, video: "/videos/excel-m6-l5.mp4", preview: false },
          { lessonTitle: "INDIRECT and OFFSET",                                  durationSeconds: 60, video: "/videos/excel-m6-l6.mp4", preview: false },
          { lessonTitle: "ARRAY Formulas (Modern Dynamic Arrays)",               durationSeconds: 60, video: "/videos/excel-m6-l7.mp4", preview: false },
          { lessonTitle: "LET and LAMBDA — New-Generation Functions",            durationSeconds: 60, video: "/videos/excel-m6-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 6 LESSONS HERE
        ],

        quiz: [
          {
            question: "What does =SUMIF(A:A, \"North\", B:B) calculate?",
            options:  [
              "Sum of all values in column B",
              "Count of cells in column A containing 'North'",
              "Sum of values in column B where column A equals 'North'",
              "Average of column B"
            ],
            answer:   2  // "Sum of values in column B where A = 'North'"
          },
          {
            question: "What is the main purpose of the LET function?",
            options:  [
              "To create a loop inside a formula",
              "To name and reuse values inside a single formula, improving readability",
              "To let users edit a locked cell",
              "To link two workbooks together"
            ],
            answer:   1  // "To name and reuse values..."
          },
          {
            question: "Dynamic Array formulas in Excel return:",
            options:  [
              "A single value only",
              "Multiple results that spill into adjacent cells automatically",
              "Results only in named ranges",
              "Values formatted as a table"
            ],
            answer:   1  // "Multiple results that spill..."
          }
          // ↓ ADD MORE MODULE 6 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 7: Excel Data Visualization
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 7: Excel Data Visualization",
        moduleDescription: "Create impactful charts, KPI visuals and dynamic dashboards.",

        lessons: [
          { lessonTitle: "Chart Basics — Bar, Line and Pie Charts",              durationSeconds: 60, video: "/videos/excel-m7-l1.mp4", preview: false },
          { lessonTitle: "Advanced Charts — Combo, Waterfall and Pareto",        durationSeconds: 60, video: "/videos/excel-m7-l2.mp4", preview: false },
          { lessonTitle: "Conditional Formatting — Color Scales and Icons",      durationSeconds: 60, video: "/videos/excel-m7-l3.mp4", preview: false },
          { lessonTitle: "Dynamic Charts",                                        durationSeconds: 60, video: "/videos/excel-m7-l4.mp4", preview: false },
          { lessonTitle: "KPI Design in Excel",                                  durationSeconds: 60, video: "/videos/excel-m7-l5.mp4", preview: false },
          { lessonTitle: "Charts for Dashboard Building",                        durationSeconds: 60, video: "/videos/excel-m7-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 7 LESSONS HERE
        ],

        quiz: [
          {
            question: "Which chart type is best for showing a part-to-whole relationship?",
            options:  ["Bar Chart", "Line Chart", "Pie Chart", "Scatter Plot"],
            answer:   2  // "Pie Chart"
          },
          {
            question: "Conditional Formatting with Icon Sets can be used to:",
            options:  [
              "Insert images into cells",
              "Show visual indicators like arrows or traffic lights based on cell values",
              "Merge cells automatically",
              "Protect cells from editing"
            ],
            answer:   1  // "Show visual indicators..."
          },
          {
            question: "A Waterfall chart is typically used to show:",
            options:  [
              "Geographical data",
              "Stock price movements",
              "Cumulative effect of positive and negative values (e.g. cash flow)",
              "Employee performance rankings"
            ],
            answer:   2  // "Cumulative effect of positive and negative values"
          }
          // ↓ ADD MORE MODULE 7 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 8: Excel Dashboards
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 8: Excel Dashboards",
        moduleDescription: "Plan, build and export professional Sales and HR dashboards.",

        lessons: [
          { lessonTitle: "Dashboard Planning and Wireframing",                   durationSeconds: 60, video: "/videos/excel-m8-l1.mp4", preview: false },
          { lessonTitle: "Connecting Data Sources",                               durationSeconds: 60, video: "/videos/excel-m8-l2.mp4", preview: false },
          { lessonTitle: "Creating Dashboard KPIs",                              durationSeconds: 60, video: "/videos/excel-m8-l3.mp4", preview: false },
          { lessonTitle: "Charts, Slicers and Filters in Dashboards",            durationSeconds: 60, video: "/videos/excel-m8-l4.mp4", preview: false },
          { lessonTitle: "Designing a Sales Dashboard",                          durationSeconds: 60, video: "/videos/excel-m8-l5.mp4", preview: false },
          { lessonTitle: "Designing an HR Dashboard",                            durationSeconds: 60, video: "/videos/excel-m8-l6.mp4", preview: false },
          { lessonTitle: "Exporting Dashboards to PDF",                          durationSeconds: 60, video: "/videos/excel-m8-l7.mp4", preview: false },
          { lessonTitle: "Dashboard Project Explained",                          durationSeconds: 60, video: "/videos/excel-m8-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 8 LESSONS HERE
        ],

        quiz: [
          {
            question: "What is the first step in designing a dashboard?",
            options:  [
              "Insert all your charts immediately",
              "Plan the layout and define the KPIs you want to show",
              "Format cells with colors",
              "Write macros to automate data entry"
            ],
            answer:   1  // "Plan the layout and define KPIs"
          },
          {
            question: "KPI stands for:",
            options:  [
              "Key Performance Index",
              "Knowledge Process Indicator",
              "Key Performance Indicator",
              "Known Process Integration"
            ],
            answer:   2  // "Key Performance Indicator"
          },
          {
            question: "Which Excel feature lets you filter multiple charts and tables simultaneously from one click?",
            options:  ["AutoFilter", "Slicer", "Conditional Formatting", "Data Validation"],
            answer:   1  // "Slicer"
          }
          // ↓ ADD MORE MODULE 8 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 9: Automation in Excel (Power Tools)
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 9: Automation in Excel (Power Tools)",
        moduleDescription: "Record macros, write basic VBA and automate reports with Power Tools.",

        lessons: [
          { lessonTitle: "Introduction to Macros",                               durationSeconds: 60, video: "/videos/excel-m9-l1.mp4", preview: false },
          { lessonTitle: "Macro Recorder — No Coding Required",                  durationSeconds: 60, video: "/videos/excel-m9-l2.mp4", preview: false },
          { lessonTitle: "VBA Basics",                                            durationSeconds: 60, video: "/videos/excel-m9-l3.mp4", preview: false },
          { lessonTitle: "Creating Buttons and Input Boxes",                     durationSeconds: 60, video: "/videos/excel-m9-l4.mp4", preview: false },
          { lessonTitle: "Automating Reports with Macros",                       durationSeconds: 60, video: "/videos/excel-m9-l5.mp4", preview: false },
          { lessonTitle: "Power Query — Data Extraction and Transformation",     durationSeconds: 60, video: "/videos/excel-m9-l6.mp4", preview: false },
          { lessonTitle: "Power Pivot — Data Modeling",                          durationSeconds: 60, video: "/videos/excel-m9-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 9 LESSONS HERE
        ],

        quiz: [
          {
            question: "What is a Macro in Excel?",
            options:  [
              "A type of chart",
              "A recorded sequence of actions that can be replayed automatically",
              "A special cell format",
              "A built-in Excel function"
            ],
            answer:   1  // "A recorded sequence of actions..."
          },
          {
            question: "VBA stands for:",
            options:  [
              "Visual Basic for Analytics",
              "Visual Basic for Applications",
              "Virtual Basic Automation",
              "Variable Based Algorithm"
            ],
            answer:   1  // "Visual Basic for Applications"
          },
          {
            question: "Power Query is used to:",
            options:  [
              "Draw charts faster",
              "Record mouse clicks",
              "Import, clean and transform data from multiple sources",
              "Create dropdown menus"
            ],
            answer:   2  // "Import, clean and transform data..."
          },
          {
            question: "Which of these is TRUE about the Macro Recorder?",
            options:  [
              "It requires advanced VBA knowledge to use",
              "It can only record formulas, not formatting",
              "It records your actions in Excel and converts them to VBA code automatically",
              "It works only on Mac versions of Excel"
            ],
            answer:   2  // "It records your actions and converts to VBA..."
          }
          // ↓ ADD MORE MODULE 9 QUIZ QUESTIONS HERE
        ]
      }

      // ↓ ADD NEW MODULES HERE
      // {
      //   moduleTitle:       "Module 10: Your New Module",
      //   moduleDescription: "Short description of what students will learn.",
      //   lessons: [
      //     { lessonTitle: "Lesson Name", durationSeconds: 60, video: "/videos/your-file.mp4", preview: false }
      //   ],
      //   quiz: [
      //     { question: "Question?", options: ["A", "B", "C", "D"], answer: 0 }
      //   ]
      // }

    ], // end curriculum

    // ══════════════════════════════════════════════════════════════
    // PROJECTS — Real-World Industry-Level Projects
    //
    // ADDING MORE PROJECTS:
    //   1. Add a new object to this array
    //   2. Set `id` to a unique string (e.g. "project-6")
    //   3. Place the PDF brief in /public/projects/
    //   4. Admin can also add projects dynamically via the admin
    //      panel in ProjectsSection by clicking "Add Project"
    //
    // COMPLETION REQUIREMENT FOR REFUND:
    //   All projects must be uploaded AND admin must set status
    //   to "accepted" (green icon) before the fee refund is unlocked.
    // ══════════════════════════════════════════════════════════════
    projects: [
      {
        id:               "project-1",
        title:            "Sales Report Automation",
        description:      "Build an automated monthly sales report with dynamic charts, KPI cards and conditional formatting using real sales data.",
        downloadFile:     "/projects/excel-project1.pdf",
        downloadFileName: "Excel_Project1_SalesReportAutomation.pdf"
      },
      {
        id:               "project-2",
        title:            "HR KPI Dashboard",
        description:      "Analyze employee attendance, performance and turnover data. Build an interactive HR KPI dashboard with slicers and Pivot Charts.",
        downloadFile:     "/projects/excel-project2.pdf",
        downloadFileName: "Excel_Project2_HRKPIDashboard.pdf"
      },
      {
        id:               "project-3",
        title:            "Inventory Management System in Excel",
        description:      "Create a fully automated inventory system with stock-level alerts, reorder tracking and a summary dashboard.",
        downloadFile:     "/projects/excel-project3.pdf",
        downloadFileName: "Excel_Project3_InventoryManagementSystem.pdf"
      },
      {
        id:               "project-4",
        title:            "Financial Modelling Intro in Excel",
        description:      "Build a 12-month revenue and expense forecasting model with scenario analysis and a management summary chart.",
        downloadFile:     "/projects/excel-project4.pdf",
        downloadFileName: "Excel_Project4_FinancialModelling.pdf"
      },
      {
        id:               "project-5",
        title:            "MIS Reporting End-to-End Project",
        description:      "Design and automate a complete Management Information System report from raw data to executive-ready output using Power Query and Macros.",
        downloadFile:     "/projects/excel-project5.pdf",
        downloadFileName: "Excel_Project5_MISReportingEndToEnd.pdf"
      }
      // ↓ ADD MORE PROJECTS HERE (admin can also add via the UI)
      // {
      //   id:               "project-6",
      //   title:            "New Project Title",
      //   description:      "Project description here.",
      //   downloadFile:     "/projects/excel-project6.pdf",
      //   downloadFileName: "Excel_Project6_Title.pdf"
      // }
    ],

    // ── VIDEO SECURITY ────────────────────────────────────────────
    videoProtection: {
      disableDownload:   true,  // Removes browser download button
      disableRightClick: true,  // Blocks right-click on video element
      showWatermark:     true,  // "GogalEdu Academy" overlay on video
      pauseOnHide:       true   // Pauses when user switches tab/window
    }

  } // end advance-excel

  // ================================================================

  // ================================================================
  // ↓ ADD NEW COURSES BELOW THIS LINE
  // ================================================================

  // ================================================================
  // COURSE: SQL FOR DATA ANALYTICS
  // URL: /courses/self-paced/sql-data-analytics
  // Total: 9 Modules | ~65 Lessons | 3 Free Preview Videos
  // Tools: MySQL / PostgreSQL / SQL Server
  // ================================================================
  , "sql-data-analytics": {

    slug: "sql-data-analytics",

    // ── HERO ──────────────────────────────────────────────────────
    hero: {
      title:    "SQL for Data Analytics",
      subtitle: "Master SQL from beginner to advanced — write complex queries, analyse real databases, work with joins, window functions and solve real business problems. Build 5 industry projects and earn a certificate.",
      tags: [
        { label: "Beginner to Advanced", icon: "target" },
        { label: "Self-Paced",           icon: "clock"  },
        { label: "Online",               icon: "online" },
        { label: "Microsoft Certified",          icon: "award"  }
      ],
      stats:   { rating: "4.8", students: "300+", projects: "5", guarantee: "100%" },
      pricing: { price: "5999", discountPrice: "2999", discount: "50% OFF" },
      image:   "/course/sql.jpg"
    },

    // ── INSTRUCTOR ────────────────────────────────────────────────
    instructor: {
      name:       "Priya Nair",
      title:      "Senior Data Analyst & SQL Trainer",
      experience: "8+ Years Industry Experience"
    },

    details: { certificate: true, lifetimeAccess: false, downloadableResources: false, mobileAccess: true },

    requirements: [
      "Basic computer knowledge",
      "Install MySQL or PostgreSQL (free — installation covered in Module 1)",
      "No prior SQL or programming experience required",
      "Laptop or desktop computer"
    ],

    tools: ["MySQL", "PostgreSQL", "SQL Server", "MySQL Workbench", "pgAdmin", "DBeaver"],

    // ── OVERVIEW CARDS ────────────────────────────────────────────
    overview: [
      "Write SQL queries from basic SELECT to advanced window functions",
      "Perform data analysis using aggregations, GROUP BY and HAVING",
      "Master all JOIN types: INNER, LEFT, RIGHT, FULL and Self JOIN",
      "Use subqueries, CTEs, derived tables and CASE statements",
      "Perform CRUD operations — INSERT, UPDATE, DELETE and CREATE TABLE",
      "Use window functions: ROW_NUMBER, RANK, LEAD, LAG and PARTITION BY",
      "Optimise queries using indexes, execution plans and best practices",
      "Build 5 real-world industry-level SQL analytics projects",
      "Solve real business problems using data from e-commerce, HR and marketing",
      "Get 100% of your course fee refunded upon full course completion"
      // ↓ ADD MORE OVERVIEW POINTS HERE
    ],

    // ══════════════════════════════════════════════════════════════
    // CURRICULUM — Free Preview + 9 Modules
    // Video files: /public/videos/sql-*.mp4
    // ══════════════════════════════════════════════════════════════
    curriculum: [

      // ─────────────────────────────────────────────────────────────
      // FREE PREVIEW (always unlocked — no quiz)
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Free Preview Lessons",
        moduleDescription: "Watch these 3 free lessons before enrolling. No login required.",
        isFreePreview:     true,
        lessons: [
          { lessonTitle: "What is SQL & Why It Is Important", durationSeconds: 60, video: "/videos/sql-free-1.mp4", preview: true },
          { lessonTitle: "SELECT Statement Basics",           durationSeconds: 60, video: "/videos/sql-free-2.mp4", preview: true },
          { lessonTitle: "Introduction to JOINs",             durationSeconds: 60, video: "/videos/sql-free-3.mp4", preview: true }
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 1: SQL Fundamentals
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 1: SQL Fundamentals",
        moduleDescription: "Understand what SQL is, how databases work and set up your tools.",
        lessons: [
          { lessonTitle: "What is SQL? Why Data Analysts Use It",               durationSeconds: 60, video: "/videos/sql-m1-l1.mp4", preview: false },
          { lessonTitle: "Databases vs Tables vs Rows vs Columns",              durationSeconds: 60, video: "/videos/sql-m1-l2.mp4", preview: false },
          { lessonTitle: "SQL vs Excel vs Power BI",                            durationSeconds: 60, video: "/videos/sql-m1-l3.mp4", preview: false },
          { lessonTitle: "Installing MySQL / PostgreSQL",                       durationSeconds: 60, video: "/videos/sql-m1-l4.mp4", preview: false },
          { lessonTitle: "Database Tools Overview (Workbench / pgAdmin)",       durationSeconds: 60, video: "/videos/sql-m1-l5.mp4", preview: false },
          { lessonTitle: "Why SQL is Important in Data Analytics",              durationSeconds: 60, video: "/videos/sql-m1-l6.mp4", preview: false },
          { lessonTitle: "Creating Your First Database",                        durationSeconds: 60, video: "/videos/sql-m1-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 1 LESSONS HERE
        ],
        quiz: [
          { question: "What does SQL stand for?",
            options: ["Standard Query Language", "Structured Query Language", "Sequential Query Logic", "Simple Query List"],
            answer: 1 },
          { question: "In a database, rows represent:",
            options: ["Column names", "Table schemas", "Individual records", "Database files"],
            answer: 2 },
          { question: "Which tool is the official GUI for MySQL?",
            options: ["pgAdmin", "DBeaver", "MySQL Workbench", "SQL Server Management Studio"],
            answer: 2 },
          { question: "SQL is primarily used to:",
            options: ["Design websites", "Query and manage relational databases", "Build mobile apps", "Create Excel macros"],
            answer: 1 }
          // ↓ ADD MORE MODULE 1 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 2: SQL Basic Queries
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 2: SQL Basic Queries",
        moduleDescription: "Write first queries — SELECT, WHERE, ORDER BY and LIMIT.",
        lessons: [
          { lessonTitle: "SELECT Statement Basics",              durationSeconds: 60, video: "/videos/sql-m2-l1.mp4", preview: false },
          { lessonTitle: "Selecting Specific Columns",           durationSeconds: 60, video: "/videos/sql-m2-l2.mp4", preview: false },
          { lessonTitle: "DISTINCT Keyword",                     durationSeconds: 60, video: "/videos/sql-m2-l3.mp4", preview: false },
          { lessonTitle: "WHERE Clause",                         durationSeconds: 60, video: "/videos/sql-m2-l4.mp4", preview: false },
          { lessonTitle: "Comparison Operators (=, >, <, >=, <=)", durationSeconds: 60, video: "/videos/sql-m2-l5.mp4", preview: false },
          { lessonTitle: "Logical Operators (AND, OR, NOT)",     durationSeconds: 60, video: "/videos/sql-m2-l6.mp4", preview: false },
          { lessonTitle: "ORDER BY Sorting",                     durationSeconds: 60, video: "/videos/sql-m2-l7.mp4", preview: false },
          { lessonTitle: "LIMIT / TOP Clause",                   durationSeconds: 60, video: "/videos/sql-m2-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 2 LESSONS HERE
        ],
        quiz: [
          { question: "Which keyword retrieves all columns from a table?",
            options: ["SELECT ALL", "SELECT *", "GET *", "FETCH ALL"],
            answer: 1 },
          { question: "Which clause filters rows based on a condition?",
            options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
            answer: 2 },
          { question: "DISTINCT is used to:",
            options: ["Sort results", "Return only unique values", "Filter nulls", "Count rows"],
            answer: 1 },
          { question: "To return the top 10 rows in MySQL, you use:",
            options: ["TOP 10", "FETCH 10", "LIMIT 10", "ROWS 10"],
            answer: 2 }
          // ↓ ADD MORE MODULE 2 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 3: Filtering & Data Aggregation
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 3: Filtering & Data Aggregation",
        moduleDescription: "Summarise data using COUNT, SUM, AVG, GROUP BY and HAVING.",
        lessons: [
          { lessonTitle: "COUNT Function",           durationSeconds: 60, video: "/videos/sql-m3-l1.mp4", preview: false },
          { lessonTitle: "SUM Function",             durationSeconds: 60, video: "/videos/sql-m3-l2.mp4", preview: false },
          { lessonTitle: "AVG Function",             durationSeconds: 60, video: "/videos/sql-m3-l3.mp4", preview: false },
          { lessonTitle: "MIN & MAX",                durationSeconds: 60, video: "/videos/sql-m3-l4.mp4", preview: false },
          { lessonTitle: "GROUP BY Clause",          durationSeconds: 60, video: "/videos/sql-m3-l5.mp4", preview: false },
          { lessonTitle: "HAVING Clause",            durationSeconds: 60, video: "/videos/sql-m3-l6.mp4", preview: false },
          { lessonTitle: "Aggregation Use Cases",    durationSeconds: 60, video: "/videos/sql-m3-l7.mp4", preview: false },
          { lessonTitle: "Filtering Grouped Data",   durationSeconds: 60, video: "/videos/sql-m3-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 3 LESSONS HERE
        ],
        quiz: [
          { question: "Which function returns the total number of rows?",
            options: ["SUM()", "TOTAL()", "COUNT()", "NUM()"],
            answer: 2 },
          { question: "HAVING is used instead of WHERE when:",
            options: ["Sorting results", "Filtering after GROUP BY aggregation", "Joining tables", "Selecting columns"],
            answer: 1 },
          { question: "Which function returns the average of a numeric column?",
            options: ["MEAN()", "AVERAGE()", "AVG()", "MID()"],
            answer: 2 },
          { question: "GROUP BY is used to:",
            options: ["Sort rows alphabetically", "Group rows with the same value for aggregation", "Remove duplicate rows", "Join two tables"],
            answer: 1 }
          // ↓ ADD MORE MODULE 3 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 4: SQL JOINs
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 4: SQL JOINs",
        moduleDescription: "Combine data from multiple tables using all JOIN types.",
        lessons: [
          { lessonTitle: "Why JOINs Are Important",  durationSeconds: 60, video: "/videos/sql-m4-l1.mp4", preview: false },
          { lessonTitle: "INNER JOIN Explained",     durationSeconds: 60, video: "/videos/sql-m4-l2.mp4", preview: false },
          { lessonTitle: "LEFT JOIN",                durationSeconds: 60, video: "/videos/sql-m4-l3.mp4", preview: false },
          { lessonTitle: "RIGHT JOIN",               durationSeconds: 60, video: "/videos/sql-m4-l4.mp4", preview: false },
          { lessonTitle: "FULL JOIN",                durationSeconds: 60, video: "/videos/sql-m4-l5.mp4", preview: false },
          { lessonTitle: "Self JOIN",                durationSeconds: 60, video: "/videos/sql-m4-l6.mp4", preview: false },
          { lessonTitle: "JOIN Multiple Tables",     durationSeconds: 60, video: "/videos/sql-m4-l7.mp4", preview: false },
          { lessonTitle: "JOIN Best Practices",      durationSeconds: 60, video: "/videos/sql-m4-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 4 LESSONS HERE
        ],
        quiz: [
          { question: "INNER JOIN returns:",
            options: ["All rows from both tables", "Only matching rows from both tables", "All rows from left table", "All rows from right table"],
            answer: 1 },
          { question: "LEFT JOIN returns:",
            options: ["Only matching rows", "All rows from left and matching from right", "All rows from right", "No rows"],
            answer: 1 },
          { question: "A Self JOIN joins:",
            options: ["Two different tables", "A table with itself", "Three tables", "Two databases"],
            answer: 1 },
          { question: "Which JOIN returns all rows from both tables regardless of match?",
            options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
            answer: 3 }
          // ↓ ADD MORE MODULE 4 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 5: Advanced SQL Queries
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 5: Advanced SQL Queries",
        moduleDescription: "Subqueries, CASE statements, UNION and query optimisation basics.",
        lessons: [
          { lessonTitle: "Subqueries",                    durationSeconds: 60, video: "/videos/sql-m5-l1.mp4", preview: false },
          { lessonTitle: "Nested Queries",                durationSeconds: 60, video: "/videos/sql-m5-l2.mp4", preview: false },
          { lessonTitle: "EXISTS vs IN",                  durationSeconds: 60, video: "/videos/sql-m5-l3.mp4", preview: false },
          { lessonTitle: "CASE Statements",               durationSeconds: 60, video: "/videos/sql-m5-l4.mp4", preview: false },
          { lessonTitle: "UNION vs UNION ALL",            durationSeconds: 60, video: "/videos/sql-m5-l5.mp4", preview: false },
          { lessonTitle: "Derived Tables",                durationSeconds: 60, video: "/videos/sql-m5-l6.mp4", preview: false },
          { lessonTitle: "SQL Query Optimisation Basics", durationSeconds: 60, video: "/videos/sql-m5-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 5 LESSONS HERE
        ],
        quiz: [
          { question: "A subquery is:",
            options: ["A stored procedure", "A query written inside another query", "A type of JOIN", "A database index"],
            answer: 1 },
          { question: "UNION vs UNION ALL — what is the difference?",
            options: ["UNION keeps duplicates; UNION ALL removes them", "UNION removes duplicates; UNION ALL keeps them", "They are identical", "UNION ALL only works with two tables"],
            answer: 1 },
          { question: "CASE statement in SQL is similar to:",
            options: ["Loops", "IF-ELSE conditional logic", "Joins", "Aggregation"],
            answer: 1 },
          { question: "EXISTS checks:",
            options: ["The count of rows", "Whether a subquery returns any rows", "If a column is null", "If two tables are equal"],
            answer: 1 }
          // ↓ ADD MORE MODULE 5 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 6: Working with Data (CRUD Operations)
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 6: Working with Data (CRUD Operations)",
        moduleDescription: "Create tables, insert, update and delete data with constraints.",
        lessons: [
          { lessonTitle: "INSERT Statement",               durationSeconds: 60, video: "/videos/sql-m6-l1.mp4", preview: false },
          { lessonTitle: "UPDATE Statement",               durationSeconds: 60, video: "/videos/sql-m6-l2.mp4", preview: false },
          { lessonTitle: "DELETE Statement",               durationSeconds: 60, video: "/videos/sql-m6-l3.mp4", preview: false },
          { lessonTitle: "Creating Tables",                durationSeconds: 60, video: "/videos/sql-m6-l4.mp4", preview: false },
          { lessonTitle: "ALTER Tables",                   durationSeconds: 60, video: "/videos/sql-m6-l5.mp4", preview: false },
          { lessonTitle: "Primary Keys & Foreign Keys",    durationSeconds: 60, video: "/videos/sql-m6-l6.mp4", preview: false },
          { lessonTitle: "Constraints (NOT NULL, UNIQUE)", durationSeconds: 60, video: "/videos/sql-m6-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 6 LESSONS HERE
        ],
        quiz: [
          { question: "CRUD stands for:",
            options: ["Create, Read, Update, Delete", "Connect, Retrieve, Update, Drop", "Create, Run, Use, Delete", "Compile, Read, Upload, Deploy"],
            answer: 0 },
          { question: "A PRIMARY KEY:",
            options: ["Can contain duplicates", "Can be NULL", "Uniquely identifies each row", "Is always a number"],
            answer: 2 },
          { question: "Which statement permanently removes rows?",
            options: ["DROP", "REMOVE", "DELETE", "CLEAR"],
            answer: 2 },
          { question: "A FOREIGN KEY references:",
            options: ["A new table", "A primary key in another table", "Duplicate rows", "A sorted column"],
            answer: 1 }
          // ↓ ADD MORE MODULE 6 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 7: Advanced SQL for Data Analytics
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 7: Advanced SQL for Data Analytics",
        moduleDescription: "Window functions, RANK, LEAD/LAG, running totals and PARTITION BY.",
        lessons: [
          { lessonTitle: "Window Functions",       durationSeconds: 60, video: "/videos/sql-m7-l1.mp4", preview: false },
          { lessonTitle: "ROW_NUMBER()",            durationSeconds: 60, video: "/videos/sql-m7-l2.mp4", preview: false },
          { lessonTitle: "RANK()",                  durationSeconds: 60, video: "/videos/sql-m7-l3.mp4", preview: false },
          { lessonTitle: "LEAD & LAG Functions",    durationSeconds: 60, video: "/videos/sql-m7-l4.mp4", preview: false },
          { lessonTitle: "Running Totals",          durationSeconds: 60, video: "/videos/sql-m7-l5.mp4", preview: false },
          { lessonTitle: "PARTITION BY",            durationSeconds: 60, video: "/videos/sql-m7-l6.mp4", preview: false },
          { lessonTitle: "Analytical SQL Queries",  durationSeconds: 60, video: "/videos/sql-m7-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 7 LESSONS HERE
        ],
        quiz: [
          { question: "Window functions operate:",
            options: ["Across all rows without grouping", "Over a defined partition without collapsing rows", "Only on filtered rows", "Only with JOINs"],
            answer: 1 },
          { question: "PARTITION BY in window functions is similar to:",
            options: ["JOIN", "WHERE", "GROUP BY", "ORDER BY"],
            answer: 2 },
          { question: "LAG() function is used to:",
            options: ["Get the next row's value", "Get the previous row's value", "Rank rows", "Count rows"],
            answer: 1 },
          { question: "ROW_NUMBER() assigns:",
            options: ["A rank with gaps for ties", "A running total", "A unique sequential number to each row", "A random number"],
            answer: 2 }
          // ↓ ADD MORE MODULE 7 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 8: SQL Performance & Best Practices
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 8: SQL Performance & Best Practices",
        moduleDescription: "Indexes, query optimisation, execution plans and clean code.",
        lessons: [
          { lessonTitle: "Indexes Explained",       durationSeconds: 60, video: "/videos/sql-m8-l1.mp4", preview: false },
          { lessonTitle: "Query Optimisation",      durationSeconds: 60, video: "/videos/sql-m8-l2.mp4", preview: false },
          { lessonTitle: "Execution Plans",         durationSeconds: 60, video: "/videos/sql-m8-l3.mp4", preview: false },
          { lessonTitle: "Normalisation Basics",    durationSeconds: 60, video: "/videos/sql-m8-l4.mp4", preview: false },
          { lessonTitle: "Avoiding Slow Queries",   durationSeconds: 60, video: "/videos/sql-m8-l5.mp4", preview: false },
          { lessonTitle: "Writing Clean SQL Code",  durationSeconds: 60, video: "/videos/sql-m8-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 8 LESSONS HERE
        ],
        quiz: [
          { question: "An index in SQL is used to:",
            options: ["Store backup data", "Speed up data retrieval", "Delete old records", "Join tables"],
            answer: 1 },
          { question: "Normalisation means:",
            options: ["Adding more columns", "Organising data to reduce redundancy and improve integrity", "Encrypting data", "Sorting tables"],
            answer: 1 },
          { question: "Using SELECT * in production is:",
            options: ["Always recommended", "Best practice", "Often avoided — fetches unnecessary columns and slows performance", "Required for JOINs"],
            answer: 2 }
          // ↓ ADD MORE MODULE 8 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 9: SQL Projects (Real Industry Use Cases)
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 9: SQL Projects (Real Industry Use Cases)",
        moduleDescription: "Apply everything on 5 real industry datasets.",
        lessons: [
          { lessonTitle: "Project 1 — E-commerce Sales Analysis Walkthrough",     durationSeconds: 60, video: "/videos/sql-m9-l1.mp4", preview: false },
          { lessonTitle: "Project 2 — Customer Segmentation Walkthrough",         durationSeconds: 60, video: "/videos/sql-m9-l2.mp4", preview: false },
          { lessonTitle: "Project 3 — HR Employee Database Analysis Walkthrough", durationSeconds: 60, video: "/videos/sql-m9-l3.mp4", preview: false },
          { lessonTitle: "Project 4 — Marketing Campaign Analysis Walkthrough",   durationSeconds: 60, video: "/videos/sql-m9-l4.mp4", preview: false },
          { lessonTitle: "Project 5 — Product Performance Dashboard Walkthrough", durationSeconds: 60, video: "/videos/sql-m9-l5.mp4", preview: false }
          // ↓ ADD MORE PROJECT WALKTHROUGH LESSONS HERE
        ],
        quiz: [
          { question: "To find total revenue per product category, you use:",
            options: ["WHERE", "ORDER BY", "GROUP BY with SUM()", "DISTINCT"],
            answer: 2 },
          { question: "Customer segmentation typically involves:",
            options: ["Only DELETE", "Grouping customers by behaviour using aggregations and CASE", "Creating new databases", "Dropping tables"],
            answer: 1 },
          { question: "To rank employees by salary within each department:",
            options: ["ORDER BY only", "RANK() with PARTITION BY department", "GROUP BY salary", "DISTINCT salary"],
            answer: 1 }
          // ↓ ADD MORE MODULE 9 QUIZ QUESTIONS HERE
        ]
      }

      // ↓ ADD NEW SQL MODULES HERE

    ], // end sql-data-analytics curriculum

    // ══════════════════════════════════════════════════════════════
    // PROJECTS — SQL for Data Analytics
    // PDF files: /public/projects/sql-project*.pdf
    // ══════════════════════════════════════════════════════════════
    projects: [
      { id: "project-1", title: "E-commerce Sales Analysis",
        description: "Analyse a real e-commerce dataset — find top products, revenue trends and customer patterns using JOINs and aggregations.",
        downloadFile: "/projects/sql-project1.pdf", downloadFileName: "SQL_Project1_EcommerceSalesAnalysis.pdf" },
      { id: "project-2", title: "Customer Segmentation",
        description: "Segment customers by purchase frequency, total spend and recency using GROUP BY, CASE and subqueries on a retail database.",
        downloadFile: "/projects/sql-project2.pdf", downloadFileName: "SQL_Project2_CustomerSegmentation.pdf" },
      { id: "project-3", title: "HR Employee Database Analysis",
        description: "Query an HR database to analyse employee performance, department headcount, salary distributions and attrition using window functions.",
        downloadFile: "/projects/sql-project3.pdf", downloadFileName: "SQL_Project3_HREmployeeDatabaseAnalysis.pdf" },
      { id: "project-4", title: "Marketing Campaign Analysis",
        description: "Measure campaign ROI, conversion rates and channel performance by running complex SQL queries on a marketing dataset.",
        downloadFile: "/projects/sql-project4.pdf", downloadFileName: "SQL_Project4_MarketingCampaignAnalysis.pdf" },
      { id: "project-5", title: "Product Performance Dashboard Queries",
        description: "Write a full set of SQL queries to power a product analytics dashboard — ranking, trends, returns and inventory insights.",
        downloadFile: "/projects/sql-project5.pdf", downloadFileName: "SQL_Project5_ProductPerformanceDashboard.pdf" }
      // ↓ ADD MORE SQL PROJECTS HERE
    ],

    videoProtection: { disableDownload: true, disableRightClick: true, showWatermark: true, pauseOnHide: true }

  } // end sql-data-analytics

  // ================================================================
  // COURSE: POWER BI
  // URL: /courses/self-paced/power-bi
  // Total: 9 Modules | ~60+ Lessons | 3 Free Preview Videos
  // Tools: Power BI Desktop, Power BI Service, DAX, Power Query
  // ================================================================
  , "power-bi": {

    slug: "power-bi",

    hero: {
      title:    "Power BI",
      subtitle: "Master Power BI from beginner to advanced — import data, build data models, write DAX and create stunning interactive dashboards. Build 5 industry projects and earn a certificate.",
      tags: [
        { label: "Beginner to Advanced", icon: "target" },
        { label: "Self-Paced",           icon: "clock"  },
        { label: "Online",               icon: "online" },
        { label: "Microsoft Certified",          icon: "award"  }
      ],
      stats:   { rating: "4.8", students: "350+", projects: "5", guarantee: "100%" },
      pricing: { price: "5999", discountPrice: "2999", discount: "50% OFF" },
      image:   "/course/powerbi.jpg"
    },

    instructor: {
      name:       "Anil Mehta",
      title:      "Power BI Developer & Business Intelligence Trainer",
      experience: "9+ Years Industry Experience"
    },

    details: { certificate: true, lifetimeAccess: false, downloadableResources: false, mobileAccess: true },

    requirements: [
      "Basic computer knowledge",
      "Download Power BI Desktop — free from Microsoft (covered in Module 1)",
      "No prior Power BI or DAX experience required",
      "Laptop or desktop with Windows OS"
    ],

    tools: ["Power BI Desktop", "Power BI Service", "Power Query", "DAX", "Power BI Mobile", "Excel"],

    overview: [
      "Import and connect data from Excel, CSV, SQL and Web sources",
      "Clean and transform messy data using Power Query",
      "Build professional data models with relationships and star schema",
      "Write DAX formulas — calculated columns, measures and KPIs",
      "Create bar, line, pie, matrix and map visuals",
      "Build interactive dashboards with slicers and drill-through filters",
      "Publish and share reports securely using Power BI Service",
      "Implement Row Level Security for role-based data access",
      "Build 5 real-world industry-level BI dashboards for your portfolio",
      "Get 100% of your course fee refunded upon full course completion"
      // ↓ ADD MORE OVERVIEW POINTS HERE
    ],

    // ══════════════════════════════════════════════════════════════
    // CURRICULUM — Free Preview + 9 Modules
    // Video files: /public/videos/powerbi-*.mp4
    // ══════════════════════════════════════════════════════════════
    curriculum: [

      // ─────────────────────────────────────────────────────────────
      // FREE PREVIEW (always unlocked — no quiz)
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Free Preview Lessons",
        moduleDescription: "Watch these 3 free lessons before enrolling. No login required.",
        isFreePreview:     true,
        lessons: [
          { lessonTitle: "Introduction to Power BI & Installation",  durationSeconds: 60, video: "/videos/powerbi-free-1.mp4", preview: true },
          { lessonTitle: "Importing Data into Power BI",              durationSeconds: 60, video: "/videos/powerbi-free-2.mp4", preview: true },
          { lessonTitle: "Creating Your First Dashboard",             durationSeconds: 60, video: "/videos/powerbi-free-3.mp4", preview: true }
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 1: Power BI Introduction
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 1: Power BI Introduction",
        moduleDescription: "Understand what Power BI is, its ecosystem and the BI workflow.",
        lessons: [
          { lessonTitle: "What is Power BI? Why Companies Use It",         durationSeconds: 60, video: "/videos/powerbi-m1-l1.mp4", preview: false },
          { lessonTitle: "Power BI Ecosystem (Desktop, Service, Mobile)",  durationSeconds: 60, video: "/videos/powerbi-m1-l2.mp4", preview: false },
          { lessonTitle: "Installing Power BI Desktop",                    durationSeconds: 60, video: "/videos/powerbi-m1-l3.mp4", preview: false },
          { lessonTitle: "Power BI Interface Tour",                        durationSeconds: 60, video: "/videos/powerbi-m1-l4.mp4", preview: false },
          { lessonTitle: "Data vs Visualisation Concepts",                 durationSeconds: 60, video: "/videos/powerbi-m1-l5.mp4", preview: false },
          { lessonTitle: "Understanding BI Workflow",                      durationSeconds: 60, video: "/videos/powerbi-m1-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 1 LESSONS HERE
        ],
        quiz: [
          { question: "Power BI Desktop is:",
            options: ["A paid enterprise tool", "A free Windows app for building reports", "A mobile-only app", "A database tool"],
            answer: 1 },
          { question: "Power BI Service is used to:",
            options: ["Build data models locally", "Publish, share and collaborate on reports online", "Install Power BI on mobile", "Write DAX"],
            answer: 1 },
          { question: "The correct Power BI workflow order is:",
            options: ["Visualise → Model → Import", "Import → Clean → Model → Visualise → Share", "Share → Import → Clean", "Model → Share → Import"],
            answer: 1 }
          // ↓ ADD MORE MODULE 1 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 2: Data Import & Data Sources
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 2: Data Import & Data Sources",
        moduleDescription: "Connect Excel, CSV, SQL databases and web data into Power BI.",
        lessons: [
          { lessonTitle: "Connecting Excel Data",         durationSeconds: 60, video: "/videos/powerbi-m2-l1.mp4", preview: false },
          { lessonTitle: "Importing CSV Files",           durationSeconds: 60, video: "/videos/powerbi-m2-l2.mp4", preview: false },
          { lessonTitle: "Importing SQL Databases",       durationSeconds: 60, video: "/videos/powerbi-m2-l3.mp4", preview: false },
          { lessonTitle: "Importing Web Data",            durationSeconds: 60, video: "/videos/powerbi-m2-l4.mp4", preview: false },
          { lessonTitle: "Data Refresh Concepts",         durationSeconds: 60, video: "/videos/powerbi-m2-l5.mp4", preview: false },
          { lessonTitle: "Data Import vs Direct Query",   durationSeconds: 60, video: "/videos/powerbi-m2-l6.mp4", preview: false },
          { lessonTitle: "Importing Data into Power BI",  durationSeconds: 60, video: "/videos/powerbi-m2-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 2 LESSONS HERE
        ],
        quiz: [
          { question: "Import mode in Power BI means:",
            options: ["Data is queried live", "Data is copied and stored inside the Power BI file", "Data is deleted", "Only images are imported"],
            answer: 1 },
          { question: "DirectQuery sends:",
            options: ["Data to Excel", "Queries live to the source database on every visual load", "Data to mobile", "Data to PDF"],
            answer: 1 },
          { question: "The most common data sources in Power BI are:",
            options: ["PDF and MP4", "CSV and Excel", "HTML only", "Images only"],
            answer: 1 }
          // ↓ ADD MORE MODULE 2 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 3: Power Query (Data Cleaning)
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 3: Power Query (Data Cleaning)",
        moduleDescription: "Clean, transform and shape messy data before loading to the model.",
        lessons: [
          { lessonTitle: "Introduction to Power Query",         durationSeconds: 60, video: "/videos/powerbi-m3-l1.mp4", preview: false },
          { lessonTitle: "Cleaning Dirty Data",                 durationSeconds: 60, video: "/videos/powerbi-m3-l2.mp4", preview: false },
          { lessonTitle: "Removing Duplicates",                 durationSeconds: 60, video: "/videos/powerbi-m3-l3.mp4", preview: false },
          { lessonTitle: "Splitting Columns",                   durationSeconds: 60, video: "/videos/powerbi-m3-l4.mp4", preview: false },
          { lessonTitle: "Merging Queries",                     durationSeconds: 60, video: "/videos/powerbi-m3-l5.mp4", preview: false },
          { lessonTitle: "Appending Data",                      durationSeconds: 60, video: "/videos/powerbi-m3-l6.mp4", preview: false },
          { lessonTitle: "Handling Missing Values",             durationSeconds: 60, video: "/videos/powerbi-m3-l7.mp4", preview: false },
          { lessonTitle: "Data Transformation Best Practices",  durationSeconds: 60, video: "/videos/powerbi-m3-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 3 LESSONS HERE
        ],
        quiz: [
          { question: "Power Query is used for:",
            options: ["Writing DAX", "Creating charts", "Cleaning and transforming data before loading", "Publishing reports"],
            answer: 2 },
          { question: "Merging queries is similar to SQL:",
            options: ["UNION", "JOIN", "GROUP BY", "DELETE"],
            answer: 1 },
          { question: "Appending queries combines:",
            options: ["Columns side by side", "Rows from multiple tables stacked on top of each other", "Two columns into one", "Tables using a key"],
            answer: 1 }
          // ↓ ADD MORE MODULE 3 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 4: Data Modeling
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 4: Data Modeling",
        moduleDescription: "Build table relationships using star schema best practices.",
        lessons: [
          { lessonTitle: "Understanding Data Models",        durationSeconds: 60, video: "/videos/powerbi-m4-l1.mp4", preview: false },
          { lessonTitle: "Relationships Between Tables",     durationSeconds: 60, video: "/videos/powerbi-m4-l2.mp4", preview: false },
          { lessonTitle: "Star Schema vs Snowflake Schema",  durationSeconds: 60, video: "/videos/powerbi-m4-l3.mp4", preview: false },
          { lessonTitle: "Creating Relationships",           durationSeconds: 60, video: "/videos/powerbi-m4-l4.mp4", preview: false },
          { lessonTitle: "Managing Cardinality",             durationSeconds: 60, video: "/videos/powerbi-m4-l5.mp4", preview: false },
          { lessonTitle: "Role Playing Dimensions",          durationSeconds: 60, video: "/videos/powerbi-m4-l6.mp4", preview: false },
          { lessonTitle: "Best Practices for Data Modeling", durationSeconds: 60, video: "/videos/powerbi-m4-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 4 LESSONS HERE
        ],
        quiz: [
          { question: "Star schema has:",
            options: ["Multiple fact tables", "One central fact table connected to multiple dimension tables", "Only dimension tables", "One table only"],
            answer: 1 },
          { question: "Cardinality refers to:",
            options: ["Number of charts", "Relationship type between tables (one-to-many, many-to-many)", "Colour scheme", "Number of columns"],
            answer: 1 },
          { question: "Best practice for Power BI modeling is:",
            options: ["Snowflake schema always", "Star schema for simplicity and performance", "No relationships", "One table only"],
            answer: 1 }
          // ↓ ADD MORE MODULE 4 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 5: DAX Fundamentals
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 5: DAX Fundamentals",
        moduleDescription: "Write DAX measures and calculated columns — SUM, COUNT, IF and more.",
        lessons: [
          { lessonTitle: "What is DAX?",                     durationSeconds: 60, video: "/videos/powerbi-m5-l1.mp4", preview: false },
          { lessonTitle: "Calculated Columns vs Measures",   durationSeconds: 60, video: "/videos/powerbi-m5-l2.mp4", preview: false },
          { lessonTitle: "Basic DAX Functions",              durationSeconds: 60, video: "/videos/powerbi-m5-l3.mp4", preview: false },
          { lessonTitle: "SUM, COUNT, DISTINCTCOUNT",        durationSeconds: 60, video: "/videos/powerbi-m5-l4.mp4", preview: false },
          { lessonTitle: "IF Statements in DAX",             durationSeconds: 60, video: "/videos/powerbi-m5-l5.mp4", preview: false },
          { lessonTitle: "Aggregation Functions",            durationSeconds: 60, video: "/videos/powerbi-m5-l6.mp4", preview: false },
          { lessonTitle: "Filter Context Explained",         durationSeconds: 60, video: "/videos/powerbi-m5-l7.mp4", preview: false },
          { lessonTitle: "DAX Best Practices",               durationSeconds: 60, video: "/videos/powerbi-m5-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 5 LESSONS HERE
        ],
        quiz: [
          { question: "DAX stands for:",
            options: ["Data Analysis Expressions", "Data Aggregation XML", "Dynamic Analysis Extension", "Data Access Exchange"],
            answer: 0 },
          { question: "A DAX Measure is:",
            options: ["A fixed value stored in a column", "A dynamic calculation that changes based on filter context", "A type of relationship", "A Power Query step"],
            answer: 1 },
          { question: "CALCULATE in DAX is used to:",
            options: ["Import data", "Change the filter context of a measure", "Create a relationship", "Delete a column"],
            answer: 1 },
          { question: "Filter context means:",
            options: ["The file format", "The active filters applied to a visual that affect DAX calculations", "The colour theme", "The data source"],
            answer: 1 }
          // ↓ ADD MORE MODULE 5 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 6: Data Visualisation & Dashboard Design
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 6: Data Visualisation & Dashboard Design",
        moduleDescription: "Create professional dashboards with charts, slicers and formatting.",
        lessons: [
          { lessonTitle: "Understanding Power BI Visuals",       durationSeconds: 60, video: "/videos/powerbi-m6-l1.mp4", preview: false },
          { lessonTitle: "Creating Charts (Bar, Line, Pie)",     durationSeconds: 60, video: "/videos/powerbi-m6-l2.mp4", preview: false },
          { lessonTitle: "Tables & Matrix Visuals",              durationSeconds: 60, video: "/videos/powerbi-m6-l3.mp4", preview: false },
          { lessonTitle: "Slicers & Filters",                    durationSeconds: 60, video: "/videos/powerbi-m6-l4.mp4", preview: false },
          { lessonTitle: "Conditional Formatting",               durationSeconds: 60, video: "/videos/powerbi-m6-l5.mp4", preview: false },
          { lessonTitle: "Creating Your First Dashboard",        durationSeconds: 60, video: "/videos/powerbi-m6-l6.mp4", preview: false },
          { lessonTitle: "Formatting Dashboards",                durationSeconds: 60, video: "/videos/powerbi-m6-l7.mp4", preview: false },
          { lessonTitle: "Dashboard Design Best Practices",      durationSeconds: 60, video: "/videos/powerbi-m6-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 6 LESSONS HERE
        ],
        quiz: [
          { question: "A Slicer in Power BI is used to:",
            options: ["Split a table", "Filter visuals interactively", "Write DAX", "Delete a visual"],
            answer: 1 },
          { question: "Conditional Formatting allows you to:",
            options: ["Change data source", "Apply colour rules based on data values", "Import data", "Create tables"],
            answer: 1 },
          { question: "Best visual for showing a trend over time:",
            options: ["Pie Chart", "Bar Chart", "Line Chart", "Donut Chart"],
            answer: 2 }
          // ↓ ADD MORE MODULE 6 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 7: Advanced DAX & Analytics
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 7: Advanced DAX & Analytics",
        moduleDescription: "Time intelligence, CALCULATE, YTD, MTD, running totals and ranking.",
        lessons: [
          { lessonTitle: "Time Intelligence Functions",  durationSeconds: 60, video: "/videos/powerbi-m7-l1.mp4", preview: false },
          { lessonTitle: "CALCULATE Function",           durationSeconds: 60, video: "/videos/powerbi-m7-l2.mp4", preview: false },
          { lessonTitle: "Running Totals",               durationSeconds: 60, video: "/videos/powerbi-m7-l3.mp4", preview: false },
          { lessonTitle: "YTD / MTD Calculations",       durationSeconds: 60, video: "/videos/powerbi-m7-l4.mp4", preview: false },
          { lessonTitle: "Ranking Functions",            durationSeconds: 60, video: "/videos/powerbi-m7-l5.mp4", preview: false },
          { lessonTitle: "Dynamic Measures",             durationSeconds: 60, video: "/videos/powerbi-m7-l6.mp4", preview: false },
          { lessonTitle: "Performance Optimisation",     durationSeconds: 60, video: "/videos/powerbi-m7-l7.mp4", preview: false },
          { lessonTitle: "Advanced Filtering Logic",     durationSeconds: 60, video: "/videos/powerbi-m7-l8.mp4", preview: false }
          // ↓ ADD MORE MODULE 7 LESSONS HERE
        ],
        quiz: [
          { question: "TOTALYTD calculates:",
            options: ["Last month total", "Year-to-date total", "Lifetime total", "Average per year"],
            answer: 1 },
          { question: "CALCULATE modifies:",
            options: ["The data source", "The filter context for a measure", "The visual type", "The relationship"],
            answer: 1 },
          { question: "Time Intelligence functions require:",
            options: ["Star schema only", "A marked Date table in the data model", "A SQL connection", "DirectQuery mode"],
            answer: 1 }
          // ↓ ADD MORE MODULE 7 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 8: Power BI Service (Publishing & Sharing)
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 8: Power BI Service (Publishing & Sharing)",
        moduleDescription: "Publish reports, set scheduled refresh and share securely.",
        lessons: [
          { lessonTitle: "Publishing Reports to Power BI Service",  durationSeconds: 60, video: "/videos/powerbi-m8-l1.mp4", preview: false },
          { lessonTitle: "Creating Workspaces",                      durationSeconds: 60, video: "/videos/powerbi-m8-l2.mp4", preview: false },
          { lessonTitle: "Sharing Dashboards",                       durationSeconds: 60, video: "/videos/powerbi-m8-l3.mp4", preview: false },
          { lessonTitle: "Row Level Security",                       durationSeconds: 60, video: "/videos/powerbi-m8-l4.mp4", preview: false },
          { lessonTitle: "Scheduled Data Refresh",                   durationSeconds: 60, video: "/videos/powerbi-m8-l5.mp4", preview: false },
          { lessonTitle: "Collaboration Features",                   durationSeconds: 60, video: "/videos/powerbi-m8-l6.mp4", preview: false },
          { lessonTitle: "Power BI Mobile",                          durationSeconds: 60, video: "/videos/powerbi-m8-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 8 LESSONS HERE
        ],
        quiz: [
          { question: "Row Level Security (RLS) is used to:",
            options: ["Delete rows", "Restrict data access for specific users based on roles", "Improve chart colours", "Speed up DAX"],
            answer: 1 },
          { question: "Scheduled refresh allows:",
            options: ["Manual refresh only", "Data to auto-update at set intervals", "Reports to be deleted", "New visuals to be added"],
            answer: 1 },
          { question: "Power BI Workspaces are used to:",
            options: ["Store raw data", "Organise and collaborate on reports with your team", "Build models", "Write DAX only"],
            answer: 1 }
          // ↓ ADD MORE MODULE 8 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 9: Industry Projects
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 9: Industry Projects",
        moduleDescription: "Build 5 real-world Power BI dashboards using industry datasets.",
        lessons: [
          { lessonTitle: "Project 1 — Sales Performance Dashboard Walkthrough",      durationSeconds: 60, video: "/videos/powerbi-m9-l1.mp4", preview: false },
          { lessonTitle: "Project 2 — HR Analytics Dashboard Walkthrough",           durationSeconds: 60, video: "/videos/powerbi-m9-l2.mp4", preview: false },
          { lessonTitle: "Project 3 — Finance Dashboard Walkthrough",                durationSeconds: 60, video: "/videos/powerbi-m9-l3.mp4", preview: false },
          { lessonTitle: "Project 4 — Marketing Campaign Dashboard Walkthrough",     durationSeconds: 60, video: "/videos/powerbi-m9-l4.mp4", preview: false },
          { lessonTitle: "Project 5 — Supply Chain Analytics Dashboard Walkthrough", durationSeconds: 60, video: "/videos/powerbi-m9-l5.mp4", preview: false }
          // ↓ ADD MORE PROJECT WALKTHROUGH LESSONS HERE
        ],
        quiz: [
          { question: "To calculate total YTD sales in Power BI:",
            options: ["SUM(Sales)", "TOTALYTD(SUM(Sales), 'Date'[Date])", "COUNT(Sales)", "CALCULATE(Sales, ALL('Date'))"],
            answer: 1 },
          { question: "To show sales by region on a map, you need:",
            options: ["A bar chart", "Geographic data (country or city) in your dataset", "A DAX measure only", "A SQL connection"],
            answer: 1 },
          { question: "A KPI visual requires:",
            options: ["Only a measure", "A value, a target and a trend axis", "Only a date column", "Two relationships"],
            answer: 1 }
          // ↓ ADD MORE MODULE 9 QUIZ QUESTIONS HERE
        ]
      }

      // ↓ ADD NEW POWER BI MODULES HERE

    ], // end power-bi curriculum

    // ══════════════════════════════════════════════════════════════
    // PROJECTS — Power BI
    // PDF files: /public/projects/powerbi-project*.pdf
    // ══════════════════════════════════════════════════════════════
    projects: [
      { id: "project-1", title: "Sales Performance Dashboard",
        description: "Build a fully interactive sales dashboard with KPI cards, bar/line charts, slicers and drill-through from region to product level.",
        downloadFile: "/projects/powerbi-project1.pdf", downloadFileName: "PowerBI_Project1_SalesPerformanceDashboard.pdf" },
      { id: "project-2", title: "HR Analytics Dashboard",
        description: "Analyse employee headcount, attrition, performance ratings and salary using Power BI with Row Level Security by department.",
        downloadFile: "/projects/powerbi-project2.pdf", downloadFileName: "PowerBI_Project2_HRAnalyticsDashboard.pdf" },
      { id: "project-3", title: "Finance Dashboard",
        description: "Build a finance dashboard showing P&L, revenue vs budget variance, monthly trends and YTD calculations using advanced DAX.",
        downloadFile: "/projects/powerbi-project3.pdf", downloadFileName: "PowerBI_Project3_FinanceDashboard.pdf" },
      { id: "project-4", title: "Marketing Campaign Dashboard",
        description: "Track campaign ROI, leads, conversion rates and channel performance using interactive filters and dynamic DAX measures.",
        downloadFile: "/projects/powerbi-project4.pdf", downloadFileName: "PowerBI_Project4_MarketingCampaignDashboard.pdf" },
      { id: "project-5", title: "Supply Chain Analytics Dashboard",
        description: "Monitor inventory, supplier performance, delivery timelines and procurement spend with drill-through and trend analysis.",
        downloadFile: "/projects/powerbi-project5.pdf", downloadFileName: "PowerBI_Project5_SupplyChainAnalyticsDashboard.pdf" }
      // ↓ ADD MORE POWER BI PROJECTS HERE
    ],

    videoProtection: { disableDownload: true, disableRightClick: true, showWatermark: true, pauseOnHide: true }

  } // end power-bi

  // ================================================================
  // COURSE: TABLEAU FOR DATA VISUALISATION
  // URL: /courses/self-paced/tableau-data-visualization
  // Total: 9 Modules | ~60+ Lessons | 3 Free Preview Videos
  // Tools: Tableau Desktop, Tableau Public
  // ================================================================
  , "tableau": {

    slug: "tableau",

    hero: {
      title:    "Tableau",
      subtitle: "Master Tableau from beginner to advanced — connect data, build dashboards, use LOD expressions and create professional BI reports. Build 5 industry projects and earn a certificate.",
      tags: [
        { label: "Beginner to Advanced", icon: "target" },
        { label: "Self-Paced",           icon: "clock"  },
        { label: "Online",               icon: "online" },
        { label: "Microsoft Certified",          icon: "award"  }
      ],
      stats:   { rating: "4.7", students: "250+", projects: "5", guarantee: "100%" },
      pricing: { price: "5999", discountPrice: "2999", discount: "50% OFF" },
      image:   "/course/tableau.jpg"
    },

    instructor: {
      name:       "Sneha Kulkarni",
      title:      "Tableau Certified Associate & Data Visualisation Expert",
      experience: "7+ Years Industry Experience"
    },

    details: { certificate: true, lifetimeAccess: false, downloadableResources: false, mobileAccess: true },

    requirements: [
      "Basic computer knowledge",
      "Download Tableau Public (free) or Tableau Desktop trial",
      "No prior Tableau experience required",
      "Laptop or desktop computer"
    ],

    tools: ["Tableau Desktop", "Tableau Public", "Tableau Server (overview)", "Excel / CSV"],

    overview: [
      "Connect data from Excel, CSV and databases into Tableau",
      "Create bar, line, pie, scatter, map and heat map visuals",
      "Build interactive dashboards with filters, actions and drill-through",
      "Write calculated fields, string, date and logical functions",
      "Use Level of Detail (LOD) expressions: FIXED, INCLUDE, EXCLUDE",
      "Apply table calculations, running totals and moving averages",
      "Build dual axis charts, bullet charts and tree maps",
      "Publish and share dashboards on Tableau Public and Tableau Server",
      "Build 5 real-world industry-level Tableau dashboards",
      "Get 100% of your course fee refunded upon full course completion"
      // ↓ ADD MORE OVERVIEW POINTS HERE
    ],

    // ══════════════════════════════════════════════════════════════
    // CURRICULUM — Free Preview + 9 Modules
    // Video files: /public/videos/tableau-*.mp4
    // ══════════════════════════════════════════════════════════════
    curriculum: [

      // ─────────────────────────────────────────────────────────────
      // FREE PREVIEW (always unlocked — no quiz)
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Free Preview Lessons",
        moduleDescription: "Watch these 3 free lessons before enrolling. No login required.",
        isFreePreview:     true,
        lessons: [
          { lessonTitle: "Introduction to Tableau & Installation",  durationSeconds: 60, video: "/videos/tableau-free-1.mp4", preview: true },
          { lessonTitle: "Connecting Data Sources in Tableau",       durationSeconds: 60, video: "/videos/tableau-free-2.mp4", preview: true },
          { lessonTitle: "Creating Your First Dashboard",            durationSeconds: 60, video: "/videos/tableau-free-3.mp4", preview: true }
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 1: Tableau Introduction
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 1: Tableau Introduction",
        moduleDescription: "Understand Tableau's ecosystem, interface and visualisation concepts.",
        lessons: [
          { lessonTitle: "What is Tableau & Why Businesses Use It",             durationSeconds: 60, video: "/videos/tableau-m1-l1.mp4", preview: false },
          { lessonTitle: "Tableau Ecosystem (Desktop, Public, Server)",          durationSeconds: 60, video: "/videos/tableau-m1-l2.mp4", preview: false },
          { lessonTitle: "Installing Tableau Desktop / Tableau Public",          durationSeconds: 60, video: "/videos/tableau-m1-l3.mp4", preview: false },
          { lessonTitle: "Tableau Interface Tour",                               durationSeconds: 60, video: "/videos/tableau-m1-l4.mp4", preview: false },
          { lessonTitle: "Understanding Data Visualisation Concepts",            durationSeconds: 60, video: "/videos/tableau-m1-l5.mp4", preview: false },
          { lessonTitle: "Types of Charts in Tableau",                           durationSeconds: 60, video: "/videos/tableau-m1-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 1 LESSONS HERE
        ],
        quiz: [
          { question: "Tableau Public is:",
            options: ["A paid enterprise tool", "A free version that publishes to the web", "A database tool", "A Python library"],
            answer: 1 },
          { question: "In Tableau, worksheets are used to:",
            options: ["Store raw data", "Create individual chart views", "Publish reports", "Write calculations"],
            answer: 1 },
          { question: "Tableau is primarily a tool for:",
            options: ["Database management", "Data entry", "Data visualisation and business intelligence", "Programming"],
            answer: 2 }
          // ↓ ADD MORE MODULE 1 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 2: Connecting & Understanding Data
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 2: Connecting & Understanding Data",
        moduleDescription: "Connect data sources and understand dimensions, measures and extracts.",
        lessons: [
          { lessonTitle: "Connecting Excel Data",              durationSeconds: 60, video: "/videos/tableau-m2-l1.mp4", preview: false },
          { lessonTitle: "Connecting CSV Files",               durationSeconds: 60, video: "/videos/tableau-m2-l2.mp4", preview: false },
          { lessonTitle: "Connecting Databases",               durationSeconds: 60, video: "/videos/tableau-m2-l3.mp4", preview: false },
          { lessonTitle: "Data Types & Data Roles",            durationSeconds: 60, video: "/videos/tableau-m2-l4.mp4", preview: false },
          { lessonTitle: "Dimensions vs Measures",             durationSeconds: 60, video: "/videos/tableau-m2-l5.mp4", preview: false },
          { lessonTitle: "Extract vs Live Connections",        durationSeconds: 60, video: "/videos/tableau-m2-l6.mp4", preview: false },
          { lessonTitle: "Connecting Data Sources in Tableau", durationSeconds: 60, video: "/videos/tableau-m2-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 2 LESSONS HERE
        ],
        quiz: [
          { question: "Dimensions in Tableau are typically:",
            options: ["Numeric values to aggregate", "Categorical fields used to slice or group data", "Always dates", "Calculated fields only"],
            answer: 1 },
          { question: "Extract connection means:",
            options: ["Data queried live every time", "A snapshot saved in a .hyper file for faster performance", "Data deleted from source", "Only CSVs used"],
            answer: 1 },
          { question: "Measures in Tableau are:",
            options: ["Text fields", "Numeric values that can be aggregated (SUM, AVG, etc.)", "Date columns only", "Categorical groupings"],
            answer: 1 }
          // ↓ ADD MORE MODULE 2 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 3: Creating Basic Visualisations
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 3: Creating Basic Visualisations",
        moduleDescription: "Build bar, line, pie, map and table charts with proper formatting.",
        lessons: [
          { lessonTitle: "Creating Bar Charts",       durationSeconds: 60, video: "/videos/tableau-m3-l1.mp4", preview: false },
          { lessonTitle: "Line Charts",               durationSeconds: 60, video: "/videos/tableau-m3-l2.mp4", preview: false },
          { lessonTitle: "Pie Charts",                durationSeconds: 60, video: "/videos/tableau-m3-l3.mp4", preview: false },
          { lessonTitle: "Tables & Crosstabs",        durationSeconds: 60, video: "/videos/tableau-m3-l4.mp4", preview: false },
          { lessonTitle: "Maps & Geographic Data",    durationSeconds: 60, video: "/videos/tableau-m3-l5.mp4", preview: false },
          { lessonTitle: "Highlight Tables",          durationSeconds: 60, video: "/videos/tableau-m3-l6.mp4", preview: false },
          { lessonTitle: "Formatting Visualisations", durationSeconds: 60, video: "/videos/tableau-m3-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 3 LESSONS HERE
        ],
        quiz: [
          { question: "Best chart for comparing values across categories:",
            options: ["Pie Chart", "Bar Chart", "Line Chart", "Map"],
            answer: 1 },
          { question: "To display data geographically in Tableau, you use:",
            options: ["Bar chart", "Crosstab", "Map visual with geographic roles", "Gantt chart"],
            answer: 2 },
          { question: "A Crosstab in Tableau is:",
            options: ["A scatter plot", "A text table showing values by row and column", "A map view", "A line chart"],
            answer: 1 }
          // ↓ ADD MORE MODULE 3 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 4: Tableau Calculations
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 4: Tableau Calculations",
        moduleDescription: "Write calculated fields with string, date, logical and aggregation functions.",
        lessons: [
          { lessonTitle: "Calculated Fields",          durationSeconds: 60, video: "/videos/tableau-m4-l1.mp4", preview: false },
          { lessonTitle: "String Functions",           durationSeconds: 60, video: "/videos/tableau-m4-l2.mp4", preview: false },
          { lessonTitle: "Date Functions",             durationSeconds: 60, video: "/videos/tableau-m4-l3.mp4", preview: false },
          { lessonTitle: "Logical Calculations",       durationSeconds: 60, video: "/videos/tableau-m4-l4.mp4", preview: false },
          { lessonTitle: "Aggregations in Tableau",    durationSeconds: 60, video: "/videos/tableau-m4-l5.mp4", preview: false },
          { lessonTitle: "Table Calculations Basics",  durationSeconds: 60, video: "/videos/tableau-m4-l6.mp4", preview: false },
          { lessonTitle: "Conditional Calculations",   durationSeconds: 60, video: "/videos/tableau-m4-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 4 LESSONS HERE
        ],
        quiz: [
          { question: "A Calculated Field in Tableau is:",
            options: ["A field imported from a database", "A new field created using a formula or expression", "A chart type", "A filter option"],
            answer: 1 },
          { question: "Table Calculations compute values:",
            options: ["Before data is loaded", "Relative to the current view (running total, percent of total)", "On filtered data only", "Across all worksheets"],
            answer: 1 },
          { question: "The IF function in Tableau works like:",
            options: ["SQL JOIN", "Conditional logic — returns values based on true/false conditions", "Aggregation", "A date function"],
            answer: 1 }
          // ↓ ADD MORE MODULE 4 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 5: Dashboards & Interactive Reports
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 5: Dashboards & Interactive Reports",
        moduleDescription: "Build interactive dashboards with actions, filters and device layouts.",
        lessons: [
          { lessonTitle: "Understanding Dashboards",            durationSeconds: 60, video: "/videos/tableau-m5-l1.mp4", preview: false },
          { lessonTitle: "Creating Your First Dashboard",       durationSeconds: 60, video: "/videos/tableau-m5-l2.mp4", preview: false },
          { lessonTitle: "Dashboard Layouts",                   durationSeconds: 60, video: "/videos/tableau-m5-l3.mp4", preview: false },
          { lessonTitle: "Filters & Interactive Controls",      durationSeconds: 60, video: "/videos/tableau-m5-l4.mp4", preview: false },
          { lessonTitle: "Dashboard Actions",                   durationSeconds: 60, video: "/videos/tableau-m5-l5.mp4", preview: false },
          { lessonTitle: "Device Layouts",                      durationSeconds: 60, video: "/videos/tableau-m5-l6.mp4", preview: false },
          { lessonTitle: "Best Practices for Dashboard Design", durationSeconds: 60, video: "/videos/tableau-m5-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 5 LESSONS HERE
        ],
        quiz: [
          { question: "Dashboard Actions in Tableau allow:",
            options: ["Deleting data", "Interactive filter, highlight and URL actions between sheets", "Adding data sources", "Writing DAX"],
            answer: 1 },
          { question: "Dashboard design best practice is:",
            options: ["Use as many colours as possible", "Keep it clean and focused with important KPIs visible first", "Add as many charts as possible", "Use only tables"],
            answer: 1 },
          { question: "Device layouts are used to:",
            options: ["Change the database", "Optimise dashboard for different screen sizes", "Write calculations", "Create extracts"],
            answer: 1 }
          // ↓ ADD MORE MODULE 5 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 6: Advanced Tableau Analytics
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 6: Advanced Tableau Analytics",
        moduleDescription: "LOD expressions, advanced table calculations, forecasting and moving averages.",
        lessons: [
          { lessonTitle: "Level of Detail (LOD) Expressions",  durationSeconds: 60, video: "/videos/tableau-m6-l1.mp4", preview: false },
          { lessonTitle: "FIXED, INCLUDE, EXCLUDE LOD",        durationSeconds: 60, video: "/videos/tableau-m6-l2.mp4", preview: false },
          { lessonTitle: "Table Calculations Advanced",        durationSeconds: 60, video: "/videos/tableau-m6-l3.mp4", preview: false },
          { lessonTitle: "Running Totals",                     durationSeconds: 60, video: "/videos/tableau-m6-l4.mp4", preview: false },
          { lessonTitle: "Percent of Total",                   durationSeconds: 60, video: "/videos/tableau-m6-l5.mp4", preview: false },
          { lessonTitle: "Moving Averages",                    durationSeconds: 60, video: "/videos/tableau-m6-l6.mp4", preview: false },
          { lessonTitle: "Forecasting in Tableau",             durationSeconds: 60, video: "/videos/tableau-m6-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 6 LESSONS HERE
        ],
        quiz: [
          { question: "A FIXED LOD expression computes at:",
            options: ["The current view's filter level", "A fixed dimension level regardless of view filters", "Row level only", "Using table calculations"],
            answer: 1 },
          { question: "LOD stands for:",
            options: ["Level of Data", "Level of Detail", "Lines of Data", "Limit of Display"],
            answer: 1 },
          { question: "EXCLUDE LOD removes a dimension:",
            options: ["To add it to the calculation", "To remove it from the scope of aggregation", "To fix it", "To filter rows"],
            answer: 1 }
          // ↓ ADD MORE MODULE 6 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 7: Advanced Visualisations
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 7: Advanced Visualisations",
        moduleDescription: "Dual axis, heat maps, tree maps, bullet charts and data storytelling.",
        lessons: [
          { lessonTitle: "Dual Axis Charts",       durationSeconds: 60, video: "/videos/tableau-m7-l1.mp4", preview: false },
          { lessonTitle: "Heat Maps",              durationSeconds: 60, video: "/videos/tableau-m7-l2.mp4", preview: false },
          { lessonTitle: "Tree Maps",              durationSeconds: 60, video: "/videos/tableau-m7-l3.mp4", preview: false },
          { lessonTitle: "Bullet Charts",          durationSeconds: 60, video: "/videos/tableau-m7-l4.mp4", preview: false },
          { lessonTitle: "Scatter Plots",          durationSeconds: 60, video: "/videos/tableau-m7-l5.mp4", preview: false },
          { lessonTitle: "Storytelling with Data", durationSeconds: 60, video: "/videos/tableau-m7-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 7 LESSONS HERE
        ],
        quiz: [
          { question: "A Dual Axis chart displays:",
            options: ["Two chart types on the same axis", "Two measures on separate left and right axes simultaneously", "A map", "Two dimensions filtered at once"],
            answer: 1 },
          { question: "A Bullet Chart is best for:",
            options: ["Showing trends over time", "Comparing actual performance against a target", "Geographic data", "Text analytics"],
            answer: 1 },
          { question: "A Tree Map displays:",
            options: ["Geographic data", "Hierarchical data as nested rectangles sized by value", "Time series data", "Scatter data"],
            answer: 1 }
          // ↓ ADD MORE MODULE 7 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 8: Publishing & Sharing Reports
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 8: Publishing & Sharing Reports",
        moduleDescription: "Publish to Tableau Public and Server, export and optimise performance.",
        lessons: [
          { lessonTitle: "Tableau Public Publishing",             durationSeconds: 60, video: "/videos/tableau-m8-l1.mp4", preview: false },
          { lessonTitle: "Tableau Server Overview",               durationSeconds: 60, video: "/videos/tableau-m8-l2.mp4", preview: false },
          { lessonTitle: "Sharing Dashboards",                    durationSeconds: 60, video: "/videos/tableau-m8-l3.mp4", preview: false },
          { lessonTitle: "Exporting Dashboards",                  durationSeconds: 60, video: "/videos/tableau-m8-l4.mp4", preview: false },
          { lessonTitle: "Data Refresh Concepts",                 durationSeconds: 60, video: "/videos/tableau-m8-l5.mp4", preview: false },
          { lessonTitle: "Dashboard Performance Optimisation",    durationSeconds: 60, video: "/videos/tableau-m8-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 8 LESSONS HERE
        ],
        quiz: [
          { question: "Tableau Public allows:",
            options: ["Private dashboards", "Publishing dashboards publicly to the web for free", "Row Level Security", "Enterprise connections"],
            answer: 1 },
          { question: "To improve Tableau performance you should:",
            options: ["Add more calculated fields", "Reduce marks, use extracts and minimise complex LODs", "Use only live connections", "Add more sheets"],
            answer: 1 },
          { question: "Tableau Server is used for:",
            options: ["Building dashboards locally", "Sharing and managing reports securely within an organisation", "Connecting CSV files", "Writing Python"],
            answer: 1 }
          // ↓ ADD MORE MODULE 8 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 9: Tableau Industry Projects
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 9: Tableau Industry Projects",
        moduleDescription: "Build 5 real-world dashboards using industry datasets.",
        lessons: [
          { lessonTitle: "Project 1 — Sales Performance Dashboard Walkthrough",    durationSeconds: 60, video: "/videos/tableau-m9-l1.mp4", preview: false },
          { lessonTitle: "Project 2 — Customer Behaviour Dashboard Walkthrough",   durationSeconds: 60, video: "/videos/tableau-m9-l2.mp4", preview: false },
          { lessonTitle: "Project 3 — HR Analytics Dashboard Walkthrough",         durationSeconds: 60, video: "/videos/tableau-m9-l3.mp4", preview: false },
          { lessonTitle: "Project 4 — Marketing Performance Dashboard Walkthrough",durationSeconds: 60, video: "/videos/tableau-m9-l4.mp4", preview: false },
          { lessonTitle: "Project 5 — Financial Analytics Dashboard Walkthrough",  durationSeconds: 60, video: "/videos/tableau-m9-l5.mp4", preview: false }
          // ↓ ADD MORE PROJECT WALKTHROUGH LESSONS HERE
        ],
        quiz: [
          { question: "Year-over-year comparison in Tableau is best shown with:",
            options: ["A tree map", "A dual axis line chart with year as the colour", "A pie chart", "A scatter plot only"],
            answer: 1 },
          { question: "Customer behaviour analysis in Tableau uses:",
            options: ["Only bar charts", "Segmentation, scatter plots and LOD expressions", "Only maps", "Only calculated fields"],
            answer: 1 },
          { question: "A financial dashboard should prioritise:",
            options: ["As many colours as possible", "Clear KPIs, trend lines and variance analysis with clean formatting", "Only pie charts", "Text tables only"],
            answer: 1 }
          // ↓ ADD MORE MODULE 9 QUIZ QUESTIONS HERE
        ]
      }

      // ↓ ADD NEW TABLEAU MODULES HERE

    ], // end tableau-data-visualization curriculum

    // ══════════════════════════════════════════════════════════════
    // PROJECTS — Tableau for Data Visualisation
    // PDF files: /public/projects/tableau-project*.pdf
    // ══════════════════════════════════════════════════════════════
    projects: [
      { id: "project-1", title: "Sales Performance Dashboard",
        description: "Build an interactive sales dashboard with KPI cards, regional map, bar/line charts and dynamic filters.",
        downloadFile: "/projects/tableau-project1.pdf", downloadFileName: "Tableau_Project1_SalesPerformanceDashboard.pdf" },
      { id: "project-2", title: "Customer Behaviour Dashboard",
        description: "Analyse customer patterns, frequency and retention using scatter plots, cohort views and LOD calculations.",
        downloadFile: "/projects/tableau-project2.pdf", downloadFileName: "Tableau_Project2_CustomerBehaviourDashboard.pdf" },
      { id: "project-3", title: "HR Analytics Dashboard",
        description: "Visualise attrition, headcount by department, performance ratings and salary bands using interactive Tableau views.",
        downloadFile: "/projects/tableau-project3.pdf", downloadFileName: "Tableau_Project3_HRAnalyticsDashboard.pdf" },
      { id: "project-4", title: "Marketing Performance Dashboard",
        description: "Track impressions, clicks, conversions and ROI across channels using dual axis charts and trend analysis.",
        downloadFile: "/projects/tableau-project4.pdf", downloadFileName: "Tableau_Project4_MarketingPerformanceDashboard.pdf" },
      { id: "project-5", title: "Financial Analytics Dashboard",
        description: "Build a P&L dashboard with revenue, expense and profit margin trend analysis using LOD and table calculations.",
        downloadFile: "/projects/tableau-project5.pdf", downloadFileName: "Tableau_Project5_FinancialAnalyticsDashboard.pdf" }
      // ↓ ADD MORE TABLEAU PROJECTS HERE
    ],

    videoProtection: { disableDownload: true, disableRightClick: true, showWatermark: true, pauseOnHide: true }

  } // end tableau-data-visualization

  // ================================================================
  // COURSE: PYTHON FOR DATA ANALYTICS
  // URL: /courses/self-paced/python-data-analytics
  // Total: 10 Modules | ~70+ Lessons | 3 Free Preview Videos
  // Tools: Python, Jupyter Notebook, Pandas, NumPy, Matplotlib, Seaborn
  // ================================================================
  , "python-data-analytics": {

    slug: "python-data-analytics",

    hero: {
      title:    "Python for Data Analytics",
      subtitle: "Master Python from beginner to advanced — learn Pandas, NumPy, Matplotlib and Seaborn. Automate tasks, clean data and build 6 industry-level projects. Earn a certificate and qualify for a full fee refund.",
      tags: [
        { label: "Beginner to Advanced", icon: "target" },
        { label: "Self-Paced",           icon: "clock"  },
        { label: "Online",               icon: "online" },
        { label: "Microsoft Certified",          icon: "award"  }
      ],
      stats:   { rating: "4.9", students: "500+", projects: "6", guarantee: "100%" },
      pricing: { price: "5999", discountPrice: "2999", discount: "50% OFF" },
      image:   "/course/python.jpg"
    },

    instructor: {
      name:       "Vikram Joshi",
      title:      "Python Developer & Data Analytics Trainer",
      experience: "11+ Years Industry Experience"
    },

    details: { certificate: true, lifetimeAccess: false, downloadableResources: false, mobileAccess: true },

    requirements: [
      "Basic computer knowledge",
      "Install Python & Anaconda (free — installation covered in Module 1)",
      "No prior programming or Python experience required",
      "Laptop or desktop (Windows / Mac / Linux)"
    ],

    tools: ["Python 3.x", "Jupyter Notebook", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Anaconda", "VS Code (optional)"],

    overview: [
      "Write Python programs from scratch — variables, loops, conditions and functions",
      "Use Pandas for loading, cleaning and analysing real datasets",
      "Perform data aggregation, grouping and transformation with Pandas",
      "Create line, bar, pie, histogram and scatter charts with Matplotlib",
      "Visualise patterns using Seaborn statistical charts",
      "Automate repetitive Excel/CSV tasks using Python scripts",
      "Perform web scraping basics and automate file handling",
      "Build 6 real-world industry projects for your portfolio",
      "Use Python for end-to-end data analytics — from raw data to insights",
      "Get 100% of your course fee refunded upon full course completion"
      // ↓ ADD MORE OVERVIEW POINTS HERE
    ],

    // ══════════════════════════════════════════════════════════════
    // CURRICULUM — Free Preview + 10 Modules
    // Video files: /public/videos/python-*.mp4
    // ══════════════════════════════════════════════════════════════
    curriculum: [

      // ─────────────────────────────────────────────────────────────
      // FREE PREVIEW (always unlocked — no quiz)
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Free Preview Lessons",
        moduleDescription: "Watch these 3 free lessons before enrolling. No login required.",
        isFreePreview:     true,
        lessons: [
          { lessonTitle: "Introduction to Python & Installation",  durationSeconds: 60, video: "/videos/python-free-1.mp4", preview: true },
          { lessonTitle: "Variables and Data Types",               durationSeconds: 60, video: "/videos/python-free-2.mp4", preview: true },
          { lessonTitle: "Data Analysis with Pandas",              durationSeconds: 60, video: "/videos/python-free-3.mp4", preview: true }
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 1: Python Introduction
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 1: Python Introduction",
        moduleDescription: "Install Python, use Jupyter Notebook and write your first program.",
        lessons: [
          { lessonTitle: "What is Python & Why It Is Popular",         durationSeconds: 60, video: "/videos/python-m1-l1.mp4", preview: false },
          { lessonTitle: "Python in Data Science & Automation",         durationSeconds: 60, video: "/videos/python-m1-l2.mp4", preview: false },
          { lessonTitle: "Installing Python & Anaconda",                durationSeconds: 60, video: "/videos/python-m1-l3.mp4", preview: false },
          { lessonTitle: "Introduction to Jupyter Notebook",            durationSeconds: 60, video: "/videos/python-m1-l4.mp4", preview: false },
          { lessonTitle: "Writing Your First Python Program",           durationSeconds: 60, video: "/videos/python-m1-l5.mp4", preview: false },
          { lessonTitle: "Python Syntax Basics",                        durationSeconds: 60, video: "/videos/python-m1-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 1 LESSONS HERE
        ],
        quiz: [
          { question: "Python is popular in data analytics because:",
            options: ["It is the fastest language", "It has powerful libraries like Pandas and NumPy", "It only works on Windows", "It replaces SQL completely"],
            answer: 1 },
          { question: "Jupyter Notebook is used to:",
            options: ["Build mobile apps", "Write and run Python code interactively with inline visualisations", "Create SQL databases", "Design dashboards only"],
            answer: 1 },
          { question: "Anaconda is:",
            options: ["A database tool", "A Python distribution bundled with data science packages and Jupyter Notebook", "A cloud service", "A programming language"],
            answer: 1 }
          // ↓ ADD MORE MODULE 1 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 2: Variables & Data Types
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 2: Variables & Data Types",
        moduleDescription: "Integers, floats, strings, booleans, type conversion and string operations.",
        lessons: [
          { lessonTitle: "Variables in Python",                              durationSeconds: 60, video: "/videos/python-m2-l1.mp4", preview: false },
          { lessonTitle: "Data Types (Integer, Float, String, Boolean)",    durationSeconds: 60, video: "/videos/python-m2-l2.mp4", preview: false },
          { lessonTitle: "Type Conversion",                                  durationSeconds: 60, video: "/videos/python-m2-l3.mp4", preview: false },
          { lessonTitle: "User Input",                                       durationSeconds: 60, video: "/videos/python-m2-l4.mp4", preview: false },
          { lessonTitle: "String Operations",                                durationSeconds: 60, video: "/videos/python-m2-l5.mp4", preview: false },
          { lessonTitle: "Variables and Data Types Explained",               durationSeconds: 60, video: "/videos/python-m2-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 2 LESSONS HERE
        ],
        quiz: [
          { question: "Which data type stores whole numbers in Python?",
            options: ["str", "bool", "int", "float"],
            answer: 2 },
          { question: "What does type() do in Python?",
            options: ["Converts to string", "Returns the data type of a variable", "Prints a value", "Deletes a variable"],
            answer: 1 },
          { question: "Result of str(42) in Python:",
            options: ["42 as an integer", "42 as a float", "'42' as a string", "An error"],
            answer: 2 }
          // ↓ ADD MORE MODULE 2 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 3: Python Operators & Conditions
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 3: Python Operators & Conditions",
        moduleDescription: "Arithmetic, comparison and logical operators with IF statements.",
        lessons: [
          { lessonTitle: "Arithmetic Operators",               durationSeconds: 60, video: "/videos/python-m3-l1.mp4", preview: false },
          { lessonTitle: "Comparison Operators",               durationSeconds: 60, video: "/videos/python-m3-l2.mp4", preview: false },
          { lessonTitle: "Logical Operators",                  durationSeconds: 60, video: "/videos/python-m3-l3.mp4", preview: false },
          { lessonTitle: "IF Statements",                      durationSeconds: 60, video: "/videos/python-m3-l4.mp4", preview: false },
          { lessonTitle: "Nested IF Conditions",               durationSeconds: 60, video: "/videos/python-m3-l5.mp4", preview: false },
          { lessonTitle: "Real-World Decision Making Programs",durationSeconds: 60, video: "/videos/python-m3-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 3 LESSONS HERE
        ],
        quiz: [
          { question: "What does == do in Python?",
            options: ["Assigns a value", "Checks if two values are equal and returns True/False", "Adds two numbers", "Concatenates strings"],
            answer: 1 },
          { question: "Keyword for multi-condition branching in Python:",
            options: ["else if", "elseif", "elif", "otherwise"],
            answer: 2 },
          { question: "The 'and' operator returns True:",
            options: ["If either condition is true", "Only if both conditions are true", "Always", "Never"],
            answer: 1 }
          // ↓ ADD MORE MODULE 3 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 4: Loops in Python
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 4: Loops in Python",
        moduleDescription: "while and for loops with break, continue, pass and nested loops.",
        lessons: [
          { lessonTitle: "While Loop",                           durationSeconds: 60, video: "/videos/python-m4-l1.mp4", preview: false },
          { lessonTitle: "For Loop",                             durationSeconds: 60, video: "/videos/python-m4-l2.mp4", preview: false },
          { lessonTitle: "Loop Control (Break, Continue, Pass)", durationSeconds: 60, video: "/videos/python-m4-l3.mp4", preview: false },
          { lessonTitle: "Nested Loops",                         durationSeconds: 60, video: "/videos/python-m4-l4.mp4", preview: false },
          { lessonTitle: "Loop Examples for Data Processing",    durationSeconds: 60, video: "/videos/python-m4-l5.mp4", preview: false }
          // ↓ ADD MORE MODULE 4 LESSONS HERE
        ],
        quiz: [
          { question: "A for loop in Python iterates over:",
            options: ["Only numbers", "Only strings", "Any iterable (list, string, range, etc.)", "Only dictionaries"],
            answer: 2 },
          { question: "The break statement:",
            options: ["Skips the current iteration", "Restarts the loop", "Exits the loop immediately", "Pauses the loop"],
            answer: 2 },
          { question: "range(1, 6) generates:",
            options: ["[1,2,3,4,5,6]", "[1,2,3,4,5]", "[0,1,2,3,4,5]", "[2,3,4,5,6]"],
            answer: 1 }
          // ↓ ADD MORE MODULE 4 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 5: Data Structures in Python
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 5: Data Structures in Python",
        moduleDescription: "Lists, tuples, sets, dictionaries and list comprehensions.",
        lessons: [
          { lessonTitle: "Lists",                    durationSeconds: 60, video: "/videos/python-m5-l1.mp4", preview: false },
          { lessonTitle: "Tuples",                   durationSeconds: 60, video: "/videos/python-m5-l2.mp4", preview: false },
          { lessonTitle: "Sets",                     durationSeconds: 60, video: "/videos/python-m5-l3.mp4", preview: false },
          { lessonTitle: "Dictionaries",             durationSeconds: 60, video: "/videos/python-m5-l4.mp4", preview: false },
          { lessonTitle: "List Comprehensions",      durationSeconds: 60, video: "/videos/python-m5-l5.mp4", preview: false },
          { lessonTitle: "Working with Nested Data", durationSeconds: 60, video: "/videos/python-m5-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 5 LESSONS HERE
        ],
        quiz: [
          { question: "Which Python data structure is immutable (cannot change after creation)?",
            options: ["List", "Dictionary", "Set", "Tuple"],
            answer: 3 },
          { question: "A Python dictionary stores data as:",
            options: ["Ordered numbers", "Key-value pairs", "Only strings", "Sets of values"],
            answer: 1 },
          { question: "A Set in Python:",
            options: ["Allows duplicates", "Is ordered", "Contains only unique values", "Is immutable"],
            answer: 2 }
          // ↓ ADD MORE MODULE 5 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 6: Python for Data Analysis
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 6: Python for Data Analysis",
        moduleDescription: "Use NumPy and Pandas to load, clean and analyse real-world datasets.",
        lessons: [
          { lessonTitle: "Introduction to NumPy",      durationSeconds: 60, video: "/videos/python-m6-l1.mp4", preview: false },
          { lessonTitle: "NumPy Arrays",               durationSeconds: 60, video: "/videos/python-m6-l2.mp4", preview: false },
          { lessonTitle: "Introduction to Pandas",     durationSeconds: 60, video: "/videos/python-m6-l3.mp4", preview: false },
          { lessonTitle: "DataFrames Explained",       durationSeconds: 60, video: "/videos/python-m6-l4.mp4", preview: false },
          { lessonTitle: "Reading CSV / Excel Files",  durationSeconds: 60, video: "/videos/python-m6-l5.mp4", preview: false },
          { lessonTitle: "Data Cleaning using Pandas", durationSeconds: 60, video: "/videos/python-m6-l6.mp4", preview: false },
          { lessonTitle: "Data Analysis with Pandas",  durationSeconds: 60, video: "/videos/python-m6-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 6 LESSONS HERE
        ],
        quiz: [
          { question: "Pandas is primarily used for:",
            options: ["Machine learning", "Data manipulation and analysis using DataFrames and Series", "Image processing", "Web development"],
            answer: 1 },
          { question: "A Pandas DataFrame is:",
            options: ["A single column", "A 2-dimensional labelled data structure with rows and columns", "A list of numbers", "A dictionary only"],
            answer: 1 },
          { question: "Which function reads a CSV in Pandas?",
            options: ["pd.read_excel()", "pd.open_csv()", "pd.read_csv()", "pd.load_csv()"],
            answer: 2 },
          { question: "NumPy is mainly used for:",
            options: ["String manipulation", "Numerical computing with arrays and mathematical operations", "Web scraping", "File handling"],
            answer: 1 }
          // ↓ ADD MORE MODULE 6 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 7: Data Visualisation in Python
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 7: Data Visualisation in Python",
        moduleDescription: "Create charts using Matplotlib and statistical visuals with Seaborn.",
        lessons: [
          { lessonTitle: "Introduction to Matplotlib",   durationSeconds: 60, video: "/videos/python-m7-l1.mp4", preview: false },
          { lessonTitle: "Line Charts",                  durationSeconds: 60, video: "/videos/python-m7-l2.mp4", preview: false },
          { lessonTitle: "Bar Charts",                   durationSeconds: 60, video: "/videos/python-m7-l3.mp4", preview: false },
          { lessonTitle: "Pie Charts",                   durationSeconds: 60, video: "/videos/python-m7-l4.mp4", preview: false },
          { lessonTitle: "Histograms",                   durationSeconds: 60, video: "/videos/python-m7-l5.mp4", preview: false },
          { lessonTitle: "Seaborn Basics",               durationSeconds: 60, video: "/videos/python-m7-l6.mp4", preview: false },
          { lessonTitle: "Visualisation Best Practices", durationSeconds: 60, video: "/videos/python-m7-l7.mp4", preview: false }
          // ↓ ADD MORE MODULE 7 LESSONS HERE
        ],
        quiz: [
          { question: "Matplotlib is used for:",
            options: ["Machine learning", "Creating static, animated and interactive visualisations", "Database management", "Web scraping"],
            answer: 1 },
          { question: "Seaborn is built on top of:",
            options: ["NumPy only", "Pandas only", "Matplotlib", "Plotly"],
            answer: 2 },
          { question: "A Histogram shows:",
            options: ["Category comparison", "Distribution of a continuous variable", "Geographic data", "Time series trends"],
            answer: 1 }
          // ↓ ADD MORE MODULE 7 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 8: Working with Real Data
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 8: Working with Real Data",
        moduleDescription: "Clean dirty data, handle missing values, aggregate and transform datasets.",
        lessons: [
          { lessonTitle: "Cleaning Dirty Data",     durationSeconds: 60, video: "/videos/python-m8-l1.mp4", preview: false },
          { lessonTitle: "Handling Missing Values", durationSeconds: 60, video: "/videos/python-m8-l2.mp4", preview: false },
          { lessonTitle: "Data Aggregation",        durationSeconds: 60, video: "/videos/python-m8-l3.mp4", preview: false },
          { lessonTitle: "Group By Operations",     durationSeconds: 60, video: "/videos/python-m8-l4.mp4", preview: false },
          { lessonTitle: "Data Transformation",     durationSeconds: 60, video: "/videos/python-m8-l5.mp4", preview: false },
          { lessonTitle: "Data Analysis Workflow",  durationSeconds: 60, video: "/videos/python-m8-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 8 LESSONS HERE
        ],
        quiz: [
          { question: "In Pandas, dropna() is used to:",
            options: ["Add missing values", "Remove rows or columns with missing (NaN) values", "Sort data", "Group data"],
            answer: 1 },
          { question: "groupby() in Pandas is similar to SQL:",
            options: ["WHERE", "ORDER BY", "GROUP BY", "JOIN"],
            answer: 2 },
          { question: "fillna() is used to:",
            options: ["Delete null values", "Replace missing values with a specified value", "Find duplicates", "Sort the DataFrame"],
            answer: 1 }
          // ↓ ADD MORE MODULE 8 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 9: Automation with Python
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 9: Automation with Python",
        moduleDescription: "Automate Excel reports, file handling, web scraping and email tasks.",
        lessons: [
          { lessonTitle: "Reading & Writing Excel Files",      durationSeconds: 60, video: "/videos/python-m9-l1.mp4", preview: false },
          { lessonTitle: "Automating Reports",                 durationSeconds: 60, video: "/videos/python-m9-l2.mp4", preview: false },
          { lessonTitle: "File Handling",                      durationSeconds: 60, video: "/videos/python-m9-l3.mp4", preview: false },
          { lessonTitle: "Web Scraping Basics",                durationSeconds: 60, video: "/videos/python-m9-l4.mp4", preview: false },
          { lessonTitle: "Sending Automated Emails",           durationSeconds: 60, video: "/videos/python-m9-l5.mp4", preview: false },
          { lessonTitle: "Python Scripts for Business Tasks",  durationSeconds: 60, video: "/videos/python-m9-l6.mp4", preview: false }
          // ↓ ADD MORE MODULE 9 LESSONS HERE
        ],
        quiz: [
          { question: "Which library reads/writes Excel files in Python?",
            options: ["Pandas (read_excel/to_excel) and openpyxl", "Matplotlib", "NumPy only", "Seaborn"],
            answer: 0 },
          { question: "Web scraping in Python uses:",
            options: ["Pandas", "BeautifulSoup and Requests", "NumPy", "Matplotlib"],
            answer: 1 },
          { question: "smtplib in Python is used to:",
            options: ["Read CSV files", "Send automated emails", "Create charts", "Scrape websites"],
            answer: 1 }
          // ↓ ADD MORE MODULE 9 QUIZ QUESTIONS HERE
        ]
      },

      // ─────────────────────────────────────────────────────────────
      // MODULE 10: Python Projects (Industry Level)
      // NOTE: This module has 6 projects — more than other courses.
      //       All 6 are listed in projects[] below.
      // ─────────────────────────────────────────────────────────────
      {
        moduleTitle:       "Module 10: Python Projects (Industry Level)",
        moduleDescription: "Build 6 real-world data analytics projects using Python.",
        lessons: [
          { lessonTitle: "Project 1 — Sales Data Analysis Walkthrough",               durationSeconds: 60, video: "/videos/python-m10-l1.mp4", preview: false },
          { lessonTitle: "Project 2 — Customer Segmentation Analysis Walkthrough",    durationSeconds: 60, video: "/videos/python-m10-l2.mp4", preview: false },
          { lessonTitle: "Project 3 — Stock Market Data Analysis Walkthrough",        durationSeconds: 60, video: "/videos/python-m10-l3.mp4", preview: false },
          { lessonTitle: "Project 4 — Automated Excel Report Generator Walkthrough",  durationSeconds: 60, video: "/videos/python-m10-l4.mp4", preview: false },
          { lessonTitle: "Project 5 — Web Scraping Data Project Walkthrough",         durationSeconds: 60, video: "/videos/python-m10-l5.mp4", preview: false },
          { lessonTitle: "Project 6 — End-to-End Data Analytics Project Walkthrough", durationSeconds: 60, video: "/videos/python-m10-l6.mp4", preview: false }
          // ↓ ADD MORE PROJECT WALKTHROUGH LESSONS HERE
        ],
        quiz: [
          { question: "Most important step after loading sales data in Python:",
            options: ["Creating charts immediately", "Cleaning and validating the data (nulls, duplicates, types)", "Exporting to Excel", "Running a loop"],
            answer: 1 },
          { question: "Customer segmentation in Python uses:",
            options: ["String functions only", "groupby() with aggregations and conditionals to define customer groups", "Only loops", "Only file handling"],
            answer: 1 },
          { question: "An end-to-end data analytics project includes:",
            options: ["Only data cleaning", "Data loading, cleaning, analysis, visualisation and insight communication", "Only visualisation", "Only automation"],
            answer: 1 }
          // ↓ ADD MORE MODULE 10 QUIZ QUESTIONS HERE
        ]
      }

      // ↓ ADD NEW PYTHON MODULES HERE

    ], // end python-data-analytics curriculum

    // ══════════════════════════════════════════════════════════════
    // PROJECTS — Python for Data Analytics
    // PDF files: /public/projects/python-project*.pdf
    // NOTE: This course has 6 projects (other courses have 5).
    // ══════════════════════════════════════════════════════════════
    projects: [
      { id: "project-1", title: "Sales Data Analysis with Python",
        description: "Load and analyse a real sales dataset with Pandas — clean data, compute KPIs, visualise trends and produce a summary report.",
        downloadFile: "/projects/python-project1.pdf", downloadFileName: "Python_Project1_SalesDataAnalysis.pdf" },
      { id: "project-2", title: "Customer Segmentation Analysis",
        description: "Segment customers by RFM (Recency, Frequency, Monetary) using Pandas groupby and visualise segments with Matplotlib and Seaborn.",
        downloadFile: "/projects/python-project2.pdf", downloadFileName: "Python_Project2_CustomerSegmentationAnalysis.pdf" },
      { id: "project-3", title: "Stock Market Data Analysis",
        description: "Download historical stock data and calculate moving averages, daily returns and volatility, then visualise with Matplotlib.",
        downloadFile: "/projects/python-project3.pdf", downloadFileName: "Python_Project3_StockMarketDataAnalysis.pdf" },
      { id: "project-4", title: "Automated Excel Report Generator",
        description: "Build a Python script that reads raw data, cleans it, calculates summaries and auto-writes a formatted Excel report using openpyxl.",
        downloadFile: "/projects/python-project4.pdf", downloadFileName: "Python_Project4_AutomatedExcelReportGenerator.pdf" },
      { id: "project-5", title: "Web Scraping Data Project",
        description: "Scrape product or financial data from a public website using BeautifulSoup and Requests, clean with Pandas and export to CSV.",
        downloadFile: "/projects/python-project5.pdf", downloadFileName: "Python_Project5_WebScrapingDataProject.pdf" },
      { id: "project-6", title: "End-to-End Data Analytics Project",
        description: "A capstone project — load a real dataset, perform full data cleaning, EDA, visualisation and present insights in a Jupyter Notebook.",
        downloadFile: "/projects/python-project6.pdf", downloadFileName: "Python_Project6_EndToEndDataAnalyticsProject.pdf" }
      // ↓ ADD MORE PYTHON PROJECTS HERE
    ],

    videoProtection: { disableDownload: true, disableRightClick: true, showWatermark: true, pauseOnHide: true }

  } // end python-data-analytics


  // ================================================================
  // ↓ ADD NEW COURSES BELOW THIS LINE
  // ================================================================
  // To add a new course:
  //  1. Add a comma after the last course's closing brace above  ↑
  //  2. Copy this template and fill in all fields:
  //
  // , "your-course-slug": {
  //   slug: "your-course-slug",
  //   hero: {
  //     title: "Course Title", subtitle: "Description.",
  //     tags:    [{ label: "Beginner to Advanced", icon: "target" }, ...],
  //     stats:   { rating: "4.8", students: "200+", projects: "5", guarantee: "100%" },
  //     pricing: { price: "5999", discountPrice: "2999", discount: "50% OFF" },
  //     image:   "/course/your-image.jpg"
  //   },
  //   instructor:   { name: "Name", title: "Title", experience: "X+ Years" },
  //   details:      { certificate: true, lifetimeAccess: false, downloadableResources: false, mobileAccess: true },
  //   requirements: ["Req 1", "Req 2"],
  //   tools:        ["Tool 1", "Tool 2"],
  //   overview:     ["Point 1", "Point 2"],
  //   curriculum: [
  //     {
  //       moduleTitle: "Free Preview Lessons",
  //       moduleDescription: "Watch these 3 free lessons before enrolling.",
  //       isFreePreview: true,
  //       lessons: [
  //         { lessonTitle: "Free Video 1", durationSeconds: 60, video: "/videos/slug-free-1.mp4", preview: true },
  //         { lessonTitle: "Free Video 2", durationSeconds: 60, video: "/videos/slug-free-2.mp4", preview: true },
  //         { lessonTitle: "Free Video 3", durationSeconds: 60, video: "/videos/slug-free-3.mp4", preview: true }
  //       ]
  //     },
  //     {
  //       moduleTitle: "Module 1: Title",
  //       moduleDescription: "Description.",
  //       lessons: [
  //         { lessonTitle: "Lesson Name", durationSeconds: 60, video: "/videos/slug-m1-l1.mp4", preview: false }
  //       ],
  //       quiz: [
  //         { question: "Question?", options: ["A", "B", "C", "D"], answer: 0 }
  //       ]
  //     }
  //   ],
  //   projects: [
  //     { id: "project-1", title: "Title", description: "Desc.",
  //       downloadFile: "/projects/slug-project1.pdf", downloadFileName: "Slug_Project1.pdf" }
  //   ],
  //   videoProtection: { disableDownload: true, disableRightClick: true, showWatermark: true, pauseOnHide: true }
  // }

};