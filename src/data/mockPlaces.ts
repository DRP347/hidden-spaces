import type { Place } from "@/types/placeTypes";

const unsplash = (photoId: string, width = 1200, height = 900) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=82`;

const image = (
  seed: string,
  alt: string,
  photoId: string,
): Place["image"] => ({
  url: unsplash(photoId),
  publicId: `hidden-spaces-daman/${seed}`,
  alt,
  width: 1200,
  height: 900,
});

const gallery = (
  seed: string,
  name: string,
  photoIds: string[],
): Place["gallery"] => [
  ...photoIds.slice(0, 6).map((photoId, index) =>
    image(
      `${seed}-${index + 1}`,
      `${name} ${index === 0 ? "wide coastal frame" : index === 1 ? "quiet detail" : index === 2 ? "evening texture" : "field guide view"}`,
      photoId,
    ),
  ),
];

export const mockPlaces: Place[] = [
  {
    id: "hsd-001",
    slug: "nani-daman-jetty-sunset-corner",
    name: "Nani Daman Jetty Sunset Corner",
    category: "Sunset",
    coordinates: { lat: 20.4189, lng: 72.8321 },
    description:
      "A quiet bend near the jetty where fishing boats pass through warm evening light.",
    coverImage: image(
      "nani-daman-jetty-sunset-cover",
      "Fishing boats near a calm coastal jetty at sunset",
      "photo-1507525428034-b723cf961d3e",
    ),
    image: image(
      "nani-daman-jetty-sunset",
      "Fishing boats near a calm coastal jetty at sunset",
      "photo-1507525428034-b723cf961d3e",
    ),
    gallery: gallery("nani-daman-jetty-sunset", "Nani Daman Jetty Sunset Corner", [
      "photo-1507525428034-b723cf961d3e",
      "photo-1519046904884-53103b34b206",
      "photo-1500530855697-b586d89ba3ee",
      "photo-1506744038136-46273834b3fb",
      "photo-1482938289607-e9573fc25ebb",
    ]),
    tags: ["golden hour", "river mouth", "calm"],
    bestTime: "5:35 PM to 6:45 PM, just before the sky turns copper",
    crowdLevel: "Gentle",
    safetyLevel: "Comfortable",
    parking: "Two-wheeler parking is easiest near the approach road.",
    visibility: "Public",
    notes:
      "Stand away from the busiest railing and wait for boats to cross the mouth of the river.",
    nearbySlugs: ["hidden-chai-corner", "riverside-peace-spot"],
  },
  {
    id: "hsd-002",
    slug: "moti-daman-fort-wall-view",
    name: "Moti Daman Fort Wall View",
    category: "Heritage",
    coordinates: { lat: 20.4136, lng: 72.8299 },
    description:
      "Old stone walls, sea breeze, and a slower view of Daman's Portuguese side.",
    coverImage: image(
      "moti-daman-fort-wall-cover",
      "Warm stone fort wall near the coast",
      "photo-1518005020951-eccb494ad742",
    ),
    image: image(
      "moti-daman-fort-wall",
      "Warm stone fort wall near the coast",
      "photo-1518005020951-eccb494ad742",
    ),
    gallery: gallery("moti-daman-fort-wall", "Moti Daman Fort Wall View", [
      "photo-1518005020951-eccb494ad742",
      "photo-1524492412937-b28074a5d7da",
      "photo-1523906834658-6e24ef2386f9",
      "photo-1519817650390-64a93db51149",
      "photo-1531572753322-ad063cecc140",
    ]),
    tags: ["fort walls", "heritage", "sea view"],
    bestTime: "4:45 PM onward when the stone cools down",
    crowdLevel: "Gentle",
    safetyLevel: "Comfortable",
    parking: "Limited roadside parking near the fort lanes.",
    visibility: "Public",
    notes:
      "The smaller wall angles feel more intimate than the obvious gate view.",
    nearbySlugs: ["old-portuguese-lane", "chapel-street-corner"],
  },
  {
    id: "hsd-003",
    slug: "jampore-morning-walk-side",
    name: "Jampore Morning Walk Side",
    category: "Peaceful",
    coordinates: { lat: 20.3847, lng: 72.8142 },
    description:
      "A soft morning stretch where the beach feels wider, quieter, and less rushed.",
    coverImage: image(
      "jampore-morning-walk-cover",
      "Quiet morning beach with open sand",
      "photo-1519046904884-53103b34b206",
    ),
    image: image(
      "jampore-morning-walk",
      "Quiet morning beach with open sand",
      "photo-1519046904884-53103b34b206",
    ),
    gallery: gallery("jampore-morning-walk", "Jampore Morning Walk Side", [
      "photo-1519046904884-53103b34b206",
      "photo-1507525428034-b723cf961d3e",
      "photo-1506744038136-46273834b3fb",
      "photo-1500530855697-b586d89ba3ee",
      "photo-1482938289607-e9573fc25ebb",
    ]),
    tags: ["morning", "slow walk", "open sand"],
    bestTime: "6:15 AM to 8:00 AM before the beach traffic grows",
    crowdLevel: "Quiet",
    safetyLevel: "Comfortable",
    parking: "Street-side spaces appear early; avoid blocking local homes.",
    visibility: "Public",
    notes:
      "This is a rhythm more than a viewpoint. Walk slowly and let the shore open up.",
    nearbySlugs: ["moti-daman-fort-wall-view", "chapel-street-corner"],
  },
  {
    id: "hsd-004",
    slug: "devka-quiet-stretch",
    name: "Devka Quiet Stretch",
    category: "Beaches",
    coordinates: { lat: 20.4463, lng: 72.8334 },
    description:
      "A less crowded edge of Devka where the sound of the water carries the scene.",
    coverImage: image(
      "devka-quiet-stretch-cover",
      "Muted beach water and open coastal edge",
      "photo-1507525428034-b723cf961d3e",
    ),
    image: image(
      "devka-quiet-stretch",
      "Muted beach water and open coastal edge",
      "photo-1507525428034-b723cf961d3e",
    ),
    gallery: gallery("devka-quiet-stretch", "Devka Quiet Stretch", [
      "photo-1507525428034-b723cf961d3e",
      "photo-1519046904884-53103b34b206",
      "photo-1500530855697-b586d89ba3ee",
      "photo-1506744038136-46273834b3fb",
      "photo-1469474968028-56623f02e42e",
    ]),
    tags: ["beach", "low crowd", "evening"],
    bestTime: "Early morning or the last hour before sunset",
    crowdLevel: "Moderate",
    safetyLevel: "Stay aware",
    parking: "Public parking varies by season; keep valuables out of sight.",
    visibility: "Public",
    notes:
      "Low tide gives this place its open, almost cinematic quiet.",
    nearbySlugs: ["beachside-photo-rock", "lighthouse-view-point"],
  },
  {
    id: "hsd-005",
    slug: "old-portuguese-lane",
    name: "Old Portuguese Lane",
    category: "Hidden Lanes",
    coordinates: { lat: 20.4142, lng: 72.8314 },
    description:
      "Narrow pastel lanes with aged walls, quiet corners, and old Daman character.",
    coverImage: image(
      "old-portuguese-lane-daman-cover",
      "Pastel heritage lane with aged walls",
      "photo-1523906834658-6e24ef2386f9",
    ),
    image: image(
      "old-portuguese-lane-daman",
      "Pastel heritage lane with aged walls",
      "photo-1523906834658-6e24ef2386f9",
    ),
    gallery: gallery("old-portuguese-lane-daman", "Old Portuguese Lane", [
      "photo-1523906834658-6e24ef2386f9",
      "photo-1518005020951-eccb494ad742",
      "photo-1524492412937-b28074a5d7da",
      "photo-1519817650390-64a93db51149",
      "photo-1531572753322-ad063cecc140",
    ]),
    tags: ["lanes", "texture", "photo walk"],
    bestTime: "Late morning shade or 4:00 PM when the lane glows softly",
    crowdLevel: "Quiet",
    safetyLevel: "Comfortable",
    parking: "Walk in from the fort side; the lane is better without a vehicle.",
    visibility: "Public",
    notes:
      "Keep voices low. This is a lived-in corner, not a staged backdrop.",
    nearbySlugs: ["moti-daman-fort-wall-view", "chapel-street-corner"],
  },
  {
    id: "hsd-006",
    slug: "riverside-peace-spot",
    name: "Riverside Peace Spot",
    category: "Peaceful",
    coordinates: { lat: 20.4114, lng: 72.8398 },
    description:
      "A still pocket near the river where the city noise fades behind the trees.",
    coverImage: image(
      "daman-riverside-peace-cover",
      "Quiet river edge with muted trees",
      "photo-1482938289607-e9573fc25ebb",
    ),
    image: image(
      "daman-riverside-peace",
      "Quiet river edge with muted trees",
      "photo-1482938289607-e9573fc25ebb",
    ),
    gallery: gallery("daman-riverside-peace", "Riverside Peace Spot", [
      "photo-1482938289607-e9573fc25ebb",
      "photo-1506744038136-46273834b3fb",
      "photo-1500530855697-b586d89ba3ee",
      "photo-1519046904884-53103b34b206",
      "photo-1469474968028-56623f02e42e",
    ]),
    tags: ["river", "quiet", "sit spot"],
    bestTime: "7:00 AM or 5:15 PM when the light stays gentle",
    crowdLevel: "Quiet",
    safetyLevel: "Go before dark",
    parking: "A few informal two-wheeler spaces sit nearby.",
    visibility: "Public",
    notes:
      "Sit for ten minutes before judging it. The place gets better when nothing happens.",
    nearbySlugs: ["nani-daman-jetty-sunset-corner", "hidden-chai-corner"],
  },
  {
    id: "hsd-007",
    slug: "lighthouse-view-point",
    name: "Lighthouse View Point",
    category: "Photo Spots",
    coordinates: { lat: 20.4149, lng: 72.8224 },
    description:
      "Clean lines, coastal air, and a strong frame for minimal sunset photos.",
    coverImage: image(
      "daman-lighthouse-view-cover",
      "Minimal coastal horizon with clear sky",
      "photo-1500530855697-b586d89ba3ee",
    ),
    image: image(
      "daman-lighthouse-view",
      "Minimal coastal horizon with clear sky",
      "photo-1500530855697-b586d89ba3ee",
    ),
    gallery: gallery("daman-lighthouse-view", "Lighthouse View Point", [
      "photo-1500530855697-b586d89ba3ee",
      "photo-1507525428034-b723cf961d3e",
      "photo-1519046904884-53103b34b206",
      "photo-1506744038136-46273834b3fb",
      "photo-1469474968028-56623f02e42e",
    ]),
    tags: ["lighthouse", "frame", "sky"],
    bestTime: "Blue hour after sunset for the cleanest color",
    crowdLevel: "Busy at peaks",
    safetyLevel: "Stay aware",
    parking: "Park before the narrow approach and walk the last stretch.",
    visibility: "Public",
    notes:
      "Wind can be strong. Keep straps secure and stay back from uneven edges.",
    nearbySlugs: ["devka-quiet-stretch", "beachside-photo-rock"],
  },
  {
    id: "hsd-008",
    slug: "hidden-chai-corner",
    name: "Hidden Chai Corner",
    category: "Food",
    coordinates: { lat: 20.4201, lng: 72.8293 },
    description:
      "A small local tea stop best experienced slowly after an evening walk.",
    coverImage: image(
      "hidden-chai-corner-daman-cover",
      "Warm tea counter and quiet cafe corner",
      "photo-1495474472287-4d71bcdd2085",
    ),
    image: image(
      "hidden-chai-corner-daman",
      "Warm tea counter and quiet cafe corner",
      "photo-1495474472287-4d71bcdd2085",
    ),
    gallery: gallery("hidden-chai-corner-daman", "Hidden Chai Corner", [
      "photo-1495474472287-4d71bcdd2085",
      "photo-1533777857889-4be7c70b33f7",
      "photo-1514933651103-005eec06c04b",
      "photo-1509042239860-f550ce710b93",
      "photo-1514432324607-a09d9b4aefdd",
    ]),
    tags: ["chai", "local", "casual"],
    bestTime: "4:30 PM to 6:00 PM before dinner crowds",
    crowdLevel: "Gentle",
    safetyLevel: "Comfortable",
    parking: "Two-wheelers can usually stop nearby for a short visit.",
    visibility: "Public",
    notes:
      "Ask what is fresh rather than ordering in a rush. The slower approach works here.",
    nearbySlugs: ["nani-daman-jetty-sunset-corner", "riverside-peace-spot"],
  },
  {
    id: "hsd-009",
    slug: "beachside-photo-rock",
    name: "Beachside Photo Rock",
    category: "Photo Spots",
    coordinates: { lat: 20.4427, lng: 72.8287 },
    description:
      "Textured rocks, open sky, and a natural foreground for cinematic portraits.",
    coverImage: image(
      "beachside-photo-rock-daman-cover",
      "Textured coastal rocks and sea light",
      "photo-1507525428034-b723cf961d3e",
    ),
    image: image(
      "beachside-photo-rock-daman",
      "Textured coastal rocks and sea light",
      "photo-1507525428034-b723cf961d3e",
    ),
    gallery: gallery("beachside-photo-rock-daman", "Beachside Photo Rock", [
      "photo-1507525428034-b723cf961d3e",
      "photo-1519046904884-53103b34b206",
      "photo-1500530855697-b586d89ba3ee",
      "photo-1506744038136-46273834b3fb",
      "photo-1469474968028-56623f02e42e",
    ]),
    tags: ["rocks", "portraits", "sea"],
    bestTime: "Sunset minus 35 minutes for warmer skin tones",
    crowdLevel: "Moderate",
    safetyLevel: "Stay aware",
    parking: "Use the main beach parking and walk down carefully.",
    visibility: "Public",
    notes:
      "Avoid wet rocks. The best frame is usually two steps farther back.",
    nearbySlugs: ["devka-quiet-stretch", "lighthouse-view-point"],
  },
  {
    id: "hsd-010",
    slug: "chapel-street-corner",
    name: "Chapel Street Corner",
    category: "Heritage",
    coordinates: { lat: 20.4131, lng: 72.8326 },
    description:
      "A calm street edge with chapel details, muted colors, and old-world silence.",
    coverImage: image(
      "chapel-street-corner-daman-cover",
      "Quiet heritage street with muted architecture",
      "photo-1524492412937-b28074a5d7da",
    ),
    image: image(
      "chapel-street-corner-daman",
      "Quiet heritage street with muted architecture",
      "photo-1524492412937-b28074a5d7da",
    ),
    gallery: gallery("chapel-street-corner-daman", "Chapel Street Corner", [
      "photo-1524492412937-b28074a5d7da",
      "photo-1518005020951-eccb494ad742",
      "photo-1523906834658-6e24ef2386f9",
      "photo-1519817650390-64a93db51149",
      "photo-1531572753322-ad063cecc140",
    ]),
    tags: ["chapel", "quiet", "heritage"],
    bestTime: "9:00 AM to 10:30 AM on weekdays",
    crowdLevel: "Gentle",
    safetyLevel: "Comfortable",
    parking: "Park outside the older lane cluster and walk in.",
    visibility: "Public",
    notes:
      "Wait for the street to clear; the architecture settles into a cleaner frame.",
    nearbySlugs: ["old-portuguese-lane", "moti-daman-fort-wall-view"],
  },
];
