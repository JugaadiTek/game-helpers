import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders'; 

const jt = {
  z: {                                  // enums, re-used objects, etc.
    stats: z.tuple([                    // [ perceived, essential ] or [ bounded, unbounded ]
      z.number().int().min(-8).max(8),  // -10 to 10 (starts -8 to 8)
      z.number().int().min(-8).max(8)   // -10 to 10 (starts -8 to 8)
    ]),
    reliances: z.object({             
      primary: z.array(               // +/- 5 to roll on these stats
        z.string()
      ).length(2),
      secondary: z.array(             // +/- 2 to roll on these stats
        z.string()
      ).length(2)
    }),
    die: z.enum([
      "d4", "d6", "d8", "d10", "d12", "d20",  // standard dice
      "d24", "d30", "d32", "d50", "d100",     // uncommon dice with 'fair' side shapes
      // common uses of standard dice to create emulate sides that are not possible with standard dice
      "d3",                   // d6 / 2 = 1&4 = 1, 3&5 = 2, 3&6 = 3 OR d6 / 2 round up
      "d%",                   // d100 OR 2d10 where 1st die is tens, 2nd die is ones
      "d3-1"                 // d6 from the Betrayal Series --> sides: [0, 0, 1, 1, 2, 2]
    ])
  }
}

const character = defineCollection({
  schema: z.object({
    player: z.string(),                     // player name
    name: z.array(z.string()).length(3),    // [first, middle, last]
    personificiation: z.string(),
    level: z.number().int().min(0).max(5),
    hunger: z.number().int(),                // min? max?
    health: z.number().int().positive(),
    perception: z.object({
      allure:       jt.z.stats,
      aural:        jt.z.stats,
      feel:         jt.z.stats,
      legerdemain:  jt.z.stats,
      remembrance:  jt.z.stats,
      resistance:   jt.z.stats,
      sight:        jt.z.stats,
      touch:        jt.z.stats
    }),
    bounding: z.object({
      consumption: jt.z.stats,
      focus:       jt.z.stats,
      imagination: jt.z.stats,
      madness:     jt.z.stats,
      magic:       jt.z.stats,
      might:       jt.z.stats,
      shield:      jt.z.stats,
      skill:       jt.z.stats
    }),
    lingering: z.array(z.object({
      key: z.string(),                          // perception.['$key'][1] 
      value: z.number(),                        // value stored from the roll,
      uses: z.array(z.boolean()).min(1).max(3)  // 1-3 boolean values, based on d6 roll as d3 (1,1,2,2,3,3)
    })),                                        // every use convert 1 false to true, when all true REMOVE
    languages: z.array(z.string()).max(5),
    mastery: z.array(z.string()).max(4),
    class: z.object({
      name: z.enum([
        
      reliances: jt.z.reliances
    }),
    blessed: z.boolean(),
    cursed: z.boolean(),
    race: z.object({
      name: z.enum(["Garullan", "Dvaraakian", "Lithchurnian", "Baelican", "Aekronian", "Jaimulian", "Qignorans"]),
      reliances: jt.z.reliances
    }),
    god: z.object({
      name: z.enum(["Angborg", "Kvoita", "Kriksi", "Nimsis", "Xerzer", "Viewke", "Qinjing"]),
      candles: z.number().int().min(0).max(7) // 0-7, FUCK GOD = 0.
    }),
    blights: z.object({
      poisoned: z.boolean(),
      burned: z.boolean(),
      frozen: z.boolean(),
      clamped: z.boolean(),
      blinded: z.boolean(),
      deafened: z.boolean(),
      mesmerized: z.boolean(),
      limited: z.boolean()
    }),
    size: z.enum([ "mini", "little", "normal", "moderate", "huge", "massive", "aria", "looming", "engulfing", "gargantuan" ]),
    gender: z.enum([
      "male", "female", "other", "unknown", "none",  "gender-ambivalent",
      "non-binary", "agender",  "genderfluid",  "genderqueer",  "bigender", "gender-nonconforming",
      "eunuch", "androgyne", "two-spirit",  "inter-sex",  "hermaphrodite",  "neutrois", "Kathoey", "Hijra"
    ]),
    attribute: z.string(),
    origin: z.string(),
    arms: z.number().int(),           // arbitrary integer
    weapons: z.array(z.tuple([
      z.boolean(),                    // is it equipped?
      z.string(),                     // weapon type
      jt.z.die                        // dice type
    ])).max(14),
    wizardry: z.array(z.tuple([
      z.string(),                     // spell type
      jt.z.die                        // die type
    ])).max(14),
    description: z.array(z.string())  // each string is a paragraph
  })
});