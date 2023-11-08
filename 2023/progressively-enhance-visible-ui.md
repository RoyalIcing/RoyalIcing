---
date: 2023-11-09
---

# Your visible UI should be a progressive enhancement

So often making for the web as a sighted user I think of the visual experience first.

What’s the layout? Which color palette? How does it look on mobile?

I’ll then mock something up in Figma or throw together a demo in Tailwind. “Ah yes, I can see it now. I think that works, but maybe I’ll tweak this color and that border.”

But what about accessibility? I want it to work for someone who will not see but hear the page with their screen reader.

“Ok, I better change my newsletter form to not be so minimal in its field labels. And I had two separate nav layouts, one for mobile and one for everything else — I’ll make sure screen reader users only hear one. This hover interaction only works with taps and clicks, I better add keyboard support.”

It leads to redesign and compromise and a guilty thought that this would all be easier if I didn’t have to worry about accessibility.

Progressive enhancement has changed the way I make web apps. Instead of diving into JavaScript powering everything like my jQuery days, I start off with what HTML is being produced by the server and which powerful CSS features I can leverage with today’s versatile web standards.

I propose adopting this mindset for accessibility too. Make a bulleted outline of the accessibility tree you expect to be on the page. Have that mockup be the basis for your visual Figma mockup.

Work out the patterns and possible compromises ahead of time in making your UI work for both keyboards and touch screens. Make the heard experience with a screen reader as great as the visible experience on a MacBook.

Take the accessibility-tree plan you have and use it to inform your end-to-end Playwright tests.

If a feature can’t easily be made accessible, rethink the feature. Do this earlier by thinking about the accessibility first.

Instead of bolting on the accessible experience next sprint, use it as your core and then everything — from visual flare to rich interactions to dark mode — will be a flavor enhancer instead of an allergen.
