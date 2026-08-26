# LYWARO Design Direction

## Three stylistic approaches

### Theme Name: Blacktop Editorial
Very dark, cinematic footwear presentation with high-contrast type, restrained chrome details, and gallery-like product staging. It makes the shoe feel engineered, collectible, and quietly expensive.

Probability: 0.07

### Theme Name: Studio Mineral
Warm off-white, graphite, and stone tones with tactile paper texture, oversized editorial typography, and sculptural product cropping. It frames LYWARO as an independent design studio rather than a conventional sportswear label.

Probability: 0.03

### Theme Name: Signal / Motion
A high-energy electric accent system with kinetic linework, sharp layout breaks, and animated wayfinding layered over a neutral base. It makes movement and technical precision visible without becoming a gaming interface.

Probability: 0.09

## Chosen approach: Blacktop Editorial

### Design Movement
Contemporary fashion editorial meets industrial product photography: the spatial restraint of a luxury lookbook, the precision of a Swiss grid, and the atmosphere of a late-night studio floor.

### Core Principles
1. **Product first, interface second.** The APEX model owns the first viewport; UI recedes until needed.
2. **Contrast with restraint.** Use deep carbon, bone, and one ownable citrus signal instead of gradients, glow, or excessive decoration.
3. **Editorial asymmetry.** Compose with offset columns, vertical annotations, oversized type, and intentional empty space rather than a centered template.
4. **Motion has mass.** Interactions should feel damped and physical: subtle parallax, drag inertia, soft reveals, and no ornamental animation for its own sake.

### Color Philosophy
The base is a near-black carbon (`#111211`) that lets the uploaded shoe model read like an object under gallery lighting. Bone (`#EAE8E1`) is warmer than white and keeps long-form sections human rather than sterile. A sharp citron signal (`#D7F54A`) is reserved for actions, product markers, and motion cues; it functions as a visual metronome, not an all-over accent. Muted graphite and smoke tones create hierarchy without introducing a second competing hue.

### Layout Paradigm
A tall, immersive editorial canvas: sticky navigation floating over the hero, a split first fold with copy pinned left and the model breathing right, then a sequence of asymmetric sections that alternate between wide visual fields and narrow text rails. Product discovery uses a deliberately staggered four-card row. On mobile, the layout becomes a vertical runway with the model preceding copy, preserving the same left edge and annotation rhythm.

### Signature Elements
- **Vertical motion index:** thin vertical labels such as `01 / APEX SERIES` and `DRAG TO ROTATE` set along the edge of sections.
- **Citron registration marks:** small crosshair ticks, corner brackets, and status dots used sparingly around product and feature content.
- **Carbon field / bone paper transitions:** hard, confident transitions between near-black product moments and warm editorial story sections, never a generic gradient fade.

### Interaction Philosophy
Every interaction should reveal capability or reduce uncertainty. Dragging the model should feel like handling an object. Hover states should expose useful actions rather than sparkle. The cart opens as a compact right-side drawer with clear price and quantity controls. Keyboard focus is visible as a citron registration ring, and touch interactions preserve normal page scrolling.

### Animation
Use transform and opacity only for UI motion. Entering elements move 12–24px on a cubic-bezier ease-out over 220–320ms, with 40–70ms stagger between related items. The 3D model uses damped rotation and subtle pointer tilt; scroll changes camera distance in small increments and never clips the silhouette. Product cards lift by 4px on hover, while imagery scales no more than 1.035. Respect `prefers-reduced-motion` by disabling nonessential reveals and model idle motion.

### Typography System
Display: `Space Grotesk`, 500–700, tight tracking, used for brand wordmark, product names, and hero statements. Body: `DM Sans`, 400–500, used for descriptions, controls, and commerce metadata. Utility: `IBM Plex Mono`, 400, uppercase, 0.14em tracking, used for labels, prices, status text, and product annotations. Hierarchy is intentionally blunt: hero display 80–132px on desktop, section heads 48–72px, product titles 18px, body 15–17px, utility 10–12px.

### Brand Essence
LYWARO is a premium movement footwear label for people who want engineered comfort with an editorial point of view; it is different because every product moment treats the shoe as an object of design, not just a commodity. Personality: **precise, kinetic, considered**.

### Brand Voice
Headlines are short, declarative, and physical. CTAs are active verbs. Microcopy is calm, useful, and never breathless. Avoid generic filler and unsupported performance promises.

Example lines:
- `BUILT FOR THE DISTANCE BETWEEN HERE AND THERE.`
- `TURN THE OBJECT. FIND YOUR ANGLE.`

### Wordmark & Logo
The wordmark uses a custom geometric treatment of `LYWARO`: the `A` is rendered as an open apex with a missing crossbar, and the `W` is tightened into a single continuous chevron. The symbol is a bold four-point apex mark formed from two interlocking chevrons, suggesting forward motion and the toe-box silhouette; it is designed to work as a favicon and as a small citron registration stamp.

### Signature Brand Color
**Apex Citron — `#D7F54A`**. It is bright enough to be ownable against carbon, warmer and more physical than a digital neon green, and used only where the brand wants the eye to move or act.

## Implementation reminders

- Use the provided `lywaro-apex.glb` as the primary hero/product visual; do not replace it with a static shoe image.
- Keep the frontend static and interaction-rich: client-side routing, product filters, wishlists, cart drawer, 3D viewer controls, and graceful model-loading fallback.
- Do not fabricate customer reviews, ratings, or testimonials. Any rating field in the brief should be rendered as unavailable or omitted until real data exists.
- Every component file should begin with a concise comment identifying the Blacktop Editorial style decisions relevant to that file.
