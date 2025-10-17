import React from "react";

export default function PregameTips() {
  const tips = [
    {
      emoji: "🎲",
      title: "Pick the Right Games",
      description:
        "Mix fast-paced party games with a few strategy hits to keep everyone entertained.",
    },
    {
      emoji: "🍹",
      title: "Set the Mood",
      description:
        "Music, snacks, and lighting make your pregame unforgettable.",
    },
    {
      emoji: "🕹️",
      title: "Know Your Crowd",
      description:
        "Choose games that match your friends' energy—chaos, strategy, or laughs.",
    },
    {
      emoji: "🏆",
      title: "Keep It Fun",
      description:
        "Friendly competition is great, but focus on laughter and epic moments.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#F9F9F9]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-[#6B0899]">Pregame Like a Pro</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <div className="text-5xl mb-4">{tip.emoji}</div>
              <h3 className="font-semibold text-xl mb-2">{tip.title}</h3>
              <p className="text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-gray-700 text-lg max-w-2xl mx-auto">
          Ready to start your legendary pregame? Check out our curated collection of
          party-ready board games to get the night rolling.
        </p>
      </div>
    </section>
  );
}
