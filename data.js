'use strict';

const STORAGE = {
  entries: 'dynoHealth.entries.v1',
  plan: 'dynoHealth.plan.v1',
  theme: 'dynoHealth.theme.v1'
};

const conditions = {
  arthritis: {
    name: 'Arthritis', icon: '🦴', tagline: 'Joint pain, stiffness, swelling, and movement',
    overview: 'Arthritis is not one disease. It is a broad group of more than 100 conditions affecting joints and nearby tissues. The type matters because osteoarthritis, rheumatoid arthritis, gout, psoriatic arthritis, and joint infection have different causes and treatments.',
    watch: ['Pain, stiffness, swelling, warmth, or reduced movement', 'Morning stiffness duration and whether symptoms affect both sides', 'Changes in walking, grip, sleep, work, or daily activities', 'New fever, rash, eye symptoms, or symptoms outside the joints'],
    actions: ['Get the arthritis type diagnosed rather than treating every joint problem as wear-and-tear.', 'Use joint-friendly activity such as walking, cycling, swimming, water exercise, or tai chi as tolerated and advised.', 'Start activity slowly. Short 5–10 minute sessions still count.', 'Protect joints from injury and discuss physical or occupational therapy when daily tasks are difficult.', 'Take prescribed disease-modifying medicine consistently; suddenly stopping can trigger flares or allow damage.'],
    urgent: 'A suddenly very painful, hot, swollen joint, especially with fever, chills, or feeling very unwell, needs urgent medical assessment because infection can damage a joint quickly.',
    discuss: ['Stiffness lasting more than 30 minutes after waking', 'Swelling that persists or returns', 'Pain that blocks sleep or normal activity', 'Medication side effects or signs of infection']
  },
  diabetes: {
    name: 'Diabetes', icon: '🩸', tagline: 'Blood glucose, medicines, food, activity, and complications',
    overview: 'Diabetes affects how the body uses glucose. Daily care may include food choices, physical activity, glucose checks, medicines, and regular screening for eye, kidney, nerve, foot, dental, and cardiovascular problems. Targets are individualized.',
    watch: ['Blood glucose with timing, meals, activity, illness, and medicines', 'Symptoms of low glucose such as shaking, sweating, confusion, weakness, or dizziness', 'Very high glucose with thirst, frequent urination, nausea, vomiting, stomach pain, fruity breath, or deep breathing', 'Foot wounds, numbness, vision changes, or repeated infections'],
    actions: ['Take medicines as prescribed even when you feel well.', 'Keep fast-acting carbohydrate available if you are at risk for low blood sugar.', 'For glucose below 70 mg/dL, CDC advises 15 grams of fast carbohydrate, wait 15 minutes, and recheck; repeat until back in your target range.', 'Follow your clinician’s sick-day and ketone-testing plan.', 'Ask about diabetes self-management education and support.'],
    urgent: 'Severe low glucose, unconsciousness, seizure, inability to swallow, high ketones, fruity breath, trouble breathing, or repeated vomiting can be life-threatening. Use prescribed glucagon if available and trained, and call emergency services.',
    discuss: ['Your personal glucose and A1C targets', 'How often and when to test', 'A written plan for low glucose and sick days', 'Foot, eye, kidney, dental, and medication reviews']
  },
  hypertension: {
    name: 'High blood pressure', icon: '❤️', tagline: 'Blood pressure patterns and cardiovascular risk',
    overview: 'High blood pressure often has no symptoms. Accurate measurements over time help a health professional confirm the diagnosis and judge whether lifestyle changes and medicines are working.',
    watch: ['Use a validated upper-arm monitor and the correct cuff size', 'Rest quietly, sit with back supported, feet flat, and arm supported at heart level', 'Record two readings when advised, along with time, medicines, stress, pain, or activity', 'Do not stop blood-pressure medicine because a single reading looks normal'],
    actions: ['Work with a clinician on a target appropriate for your health.', 'Follow a heart-healthy eating pattern, reduce sodium, stay active, avoid tobacco, manage weight, and reduce or avoid alcohol as advised.', 'Track readings at consistent times and bring the monitor to a clinic visit to compare it with office equipment.', 'Ask before using decongestants, pain relievers, supplements, or other products that may affect blood pressure.'],
    urgent: 'If blood pressure is above 180/120 mm Hg, wait at least one minute and measure again. If still that high with chest pain, shortness of breath, weakness, numbness, vision change, back pain, or difficulty speaking, call emergency services.',
    discuss: ['Home-monitor technique and cuff size', 'Your treatment target', 'Side effects, missed doses, and affordability', 'Kidney disease, pregnancy, diabetes, or other conditions affecting treatment']
  },
  psoriasis: {
    name: 'Psoriasis', icon: '🧴', tagline: 'Chronic inflammatory skin disease and possible joint symptoms',
    overview: 'Psoriasis is a chronic immune-mediated disease that can affect skin, scalp, nails, and joints. It is not contagious. Diagnosis matters because eczema, fungal infections, and other rashes can look similar.',
    watch: ['Where plaques appear and how much body area is affected', 'Itch, pain, cracking, bleeding, sleep, or emotional impact', 'Nail pitting, lifting, thickening, discoloration, or pain', 'Morning stiffness, swollen fingers or toes, heel pain, or other joint symptoms'],
    actions: ['Moisturize regularly with a fragrance-free cream, ointment, or oil.', 'Avoid scratching, skin injuries, and sunburn, which can worsen psoriasis.', 'Use prescribed topical medicine exactly where and for as long as directed.', 'Only use phototherapy under professional supervision; tanning beds add skin-cancer risk.', 'Tell a dermatologist about joint or nail symptoms because treatment may need to change.'],
    urgent: 'Seek prompt care for widespread redness, pus-filled lesions, fever, rapidly worsening pain, or signs of infection. Sudden severe widespread psoriasis can require urgent treatment.',
    discuss: ['Joint symptoms or swollen digits', 'Psoriasis on face, genitals, palms, soles, scalp, or nails', 'Treatment side effects or pregnancy plans', 'Screening for related cardiovascular and metabolic risks']
  },
  eczema: {
    name: 'Eczema', icon: '🌿', tagline: 'Dry, itchy, inflamed skin and flare triggers',
    overview: 'Eczema is a group of inflammatory skin conditions. Atopic dermatitis is the most common type and causes dry, itchy, inflamed skin. It is not contagious. A clinician can distinguish it from psoriasis, contact dermatitis, infection, and other rashes.',
    watch: ['Itch severity, sleep loss, scratching, and skin pain', 'Products, fragrance, heat, sweat, dry air, clothing, stress, and other possible triggers', 'Cracks, oozing, swelling, warmth, yellow or golden crust, or pus', 'Clusters of painful blisters with fever or feeling unwell'],
    actions: ['Use short 5–10 minute warm, not hot, baths or showers.', 'Apply a fragrance-free cream or ointment while skin is still damp and whenever dry.', 'Choose fragrance-free, dye-free products and avoid “unscented” products that may still contain fragrance.', 'Use prescribed topical medicine exactly as directed and do not improvise bleach baths or wet wraps unless a clinician recommends them.', 'Keep nails short and use cool compresses rather than scratching.'],
    urgent: 'Yellow crusts, pus, rapidly spreading redness, warmth, swelling, fever, or painful blisters can mean infection. Eczema herpeticum can be serious and needs immediate medical care.',
    discuss: ['Sleep disruption or uncontrolled itch', 'Frequent skin infections', 'Eye or eyelid involvement', 'Whether allergy or patch testing is appropriate']
  }
};

const sources = [
  { group: 'Arthritis', links: [
    ['NIAMS: Arthritis overview', 'https://www.niams.nih.gov/health-topics/arthritis'],
    ['CDC: Arthritis self-care', 'https://www.cdc.gov/arthritis/caring/index.html'],
    ['CDC: Physical activity and arthritis', 'https://www.cdc.gov/arthritis/prevention/index.html'],
    ['NIAMS: Rheumatoid arthritis', 'https://www.niams.nih.gov/health-topics/rheumatoid-arthritis'],
    ['NHS: Septic arthritis warning signs', 'https://www.nhs.uk/conditions/septic-arthritis/']
  ]},
  { group: 'Diabetes', links: [
    ['CDC: Living with diabetes', 'https://www.cdc.gov/diabetes/living-with/index.html'],
    ['CDC: Treating low blood sugar', 'https://www.cdc.gov/diabetes/treatment/treatment-low-blood-sugar-hypoglycemia.html'],
    ['CDC: Diabetic ketoacidosis', 'https://www.cdc.gov/diabetes/about/diabetic-ketoacidosis.html'],
    ['CDC: A1C testing', 'https://www.cdc.gov/diabetes/diabetes-testing/prediabetes-a1c-test.html']
  ]},
  { group: 'High blood pressure', links: [
    ['American Heart Association: Manage high blood pressure', 'https://www.heart.org/en/health-topics/high-blood-pressure/changes-you-can-make-to-manage-high-blood-pressure'],
    ['American Heart Association: Blood pressure readings', 'https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings'],
    ['2025 AHA/ACC high blood pressure guideline highlights', 'https://professional.heart.org/en/science-news/2025-high-blood-pressure-guideline/top-things-to-know']
  ]},
  { group: 'Psoriasis', links: [
    ['American Academy of Dermatology: Psoriasis overview', 'https://www.aad.org/public/diseases/psoriasis/what/overview'],
    ['AAD: Psoriasis diagnosis and treatment', 'https://www.aad.org/public/diseases/psoriasis/treatment/treatment'],
    ['AAD: Tips for managing psoriasis', 'https://www.aad.org/public/diseases/psoriasis/insider/tips'],
    ['AAD: Nonprescription psoriasis care', 'https://www.aad.org/public/diseases/psoriasis/treatment/medications/non-prescription']
  ]},
  { group: 'Eczema', links: [
    ['American Academy of Dermatology: Atopic dermatitis overview', 'https://www.aad.org/public/diseases/eczema/types/atopic-dermatitis'],
    ['AAD: Atopic dermatitis treatment', 'https://www.aad.org/public/diseases/eczema/types/atopic-dermatitis/treatment'],
    ['AAD: Atopic dermatitis skin care', 'https://www.aad.org/public/diseases/eczema/types/atopic-dermatitis/atopic-dermatitis-coping'],
    ['NIAMS: Atopic dermatitis treatment and self-care', 'https://www.niams.nih.gov/health-topics/atopic-dermatitis/diagnosis-treatment-and-steps-to-take']
  ]}
];
