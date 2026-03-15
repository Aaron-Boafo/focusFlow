
// Mocking the backend ranking logic to verify tie-handling
interface UserDoc {
  id: string;
  totalExp: number;
  displayName: string;
  hiddenFromLeaderboard?: boolean;
}

const mockDocs: UserDoc[] = [
  { id: "1", totalExp: 500, displayName: "User A" },
  { id: "2", totalExp: 400, displayName: "User B" },
  { id: "3", totalExp: 400, displayName: "User C" }, // Tie with B
  { id: "4", totalExp: 300, displayName: "User D" },
  { id: "5", totalExp: 300, displayName: "User E" }, // Tie with D
  { id: "6", totalExp: 300, displayName: "User F" }, // Tie with D, E
  { id: "7", totalExp: 200, displayName: "User G" },
];

function calculateRanks(docs: UserDoc[]) {
  let currentRank = 1;
  let prevExp = -1;
  
  return docs.map((doc, index) => {
    const exp = doc.totalExp || 0;

    if (exp !== prevExp) {
      currentRank = index + 1;
      prevExp = exp;
    }

    return {
      id: doc.id,
      rank: currentRank,
      displayName: doc.displayName,
      totalExp: exp
    };
  });
}

const results = calculateRanks(mockDocs);
console.log("Ranks calculated:");
results.forEach(r => {
  console.log(`Rank: ${r.rank}, Name: ${r.displayName}, XP: ${r.totalExp}`);
});

// Expectations:
// A: 1 (500)
// B: 2 (400)
// C: 2 (400)
// D: 4 (300)
// E: 4 (300)
// F: 4 (300)
// G: 7 (200)

const expected = [1, 2, 2, 4, 4, 4, 7];
const matches = results.every((r, i) => r.rank === expected[i]);

if (matches) {
  console.log("\nSUCCESS: Ranking logic correctly handles ties (Standard Competition Ranking).");
} else {
  console.log("\nFAILURE: Ranking logic mismatch.");
  process.exit(1);
}
