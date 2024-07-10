export const STATS_SECTION_BREAKPOINTS = [1350, 1300, 950, 700];

export const STATS_HEADER_SPACER_STYLES = {
  left: `
      flex: 1;
      order: 0;
      width: unset;
    `,
  middle: `
      flex: unset;
      order: 1;
      width: 100px;
    `,
};

export const STATS_HEADER_COLUMN_STYLES = {
  // Stat names are the left column (large version).
  leftLarge: `
    flex: unset;
    width: 180px;

    &:nth-of-type(2) {
      order: 1;
      margin-left: 0;
      margin-right: 12px;
    }

    &:last-of-type {
      order: 2;
      margin-right: 12px;
    }
  `,

  // Stat names are the left column (small version).
  leftSmall: `
    flex: unset;
    width: 160px;

    &:nth-of-type(2) {
      order: 1;
      margin-left: 0;
      margin-right: 8px;
    }

    &:last-of-type {
      order: 2;
      margin-right: 8px;
    }
  `,

  // Stat names are the middle column.
  middle: `
    flex: 1;
    width: unset;

    &:nth-of-type(2) {
      order: 0;
      margin-left: 4px;
      margin-right: 0;
    }

    &:last-of-type {
      order: 2;
      margin-right: 4px;
    }
  `,
};
