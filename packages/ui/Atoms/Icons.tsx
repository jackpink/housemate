export function RightArrow({
  height = 15,
  colour = "#0A5B5A", //#f7ece1",
}: {
  height?: number;
  colour?: string;
}) {
  return (
    <svg
      width={height}
      zoomAndPan="magnify"
      viewBox="0 0 29.108002 29.297031"
      height={height}
      preserveAspectRatio="xMidYMid"
      version="1.0"
      id="svg2"
    >
      <defs id="defs1">
        <clipPath id="a6c68e75e3">
          <path
            d="M 96.410156,72.121094 H 242.66016 V 222.12109 H 96.410156 Z m 0,0"
            clipRule="nonzero"
            id="path1"
          />
        </clipPath>
      </defs>
      <g
        clipPath="url(#a6c68e75e3)"
        id="g2"
        transform="matrix(0.19911416,0,0,0.19531864,-19.199738,-14.087357)"
      >
        <path
          fill={colour}
          d="M 97.035156,72.125 242.61328,146.47266 96.425781,222.125 c 23.550779,-41.46484 42.476559,-84.61719 0.609375,-150 z m 0,0"
          fillOpacity="1"
          fillRule="nonzero"
          id="path2"
        />
      </g>
    </svg>
  );
}

export function PropertiesIcon({
  height = 60,
  colour = "#f7ece1",
  selected = true,
  selectedColour = "#7df2cd", //"#c470e7", //
}: {
  height?: number;
  colour?: string;
  selected?: boolean;
  selectedColour?: string;
}) {
  return (
    <svg
      width={height} // * 40.86) / 34.65}
      zoomAndPan="magnify"
      viewBox="0 0 40.861275 34.651577"
      height={height}
      preserveAspectRatio="xMidYMid"
      version="1.0"
      id="svg4"
    >
      <defs id="defs1">
        <clipPath id="4b4fdd81bd">
          <path
            d="m 113,126.09375 h 149 v 123 H 113 Z m 0,0"
            clipRule="nonzero"
            id="path1"
          />
        </clipPath>
      </defs>
      <path
        fill={selected ? selectedColour : colour}
        d="M 23.068415,16.817799 H 21.03285 v -2.071087 h -1.356316 v 2.071087 h -2.035559 v -4.141065 h 5.42744 z m -2.713723,-7.4336676 2.63139,1.9115086 h -5.26278 z m 4.071123,8.1236606 v -4.831058 h 0.678158 c 0.294664,0 0.556826,-0.194783 0.646746,-0.480905 0.08991,-0.285025 -0.01298,-0.598653 -0.251331,-0.77033 L 20.750107,7.9733304 c -0.236168,-0.171677 -0.554662,-0.171677 -0.789745,0 l -4.75036,3.4521686 c -0.238331,0.171677 -0.341251,0.485305 -0.251331,0.77033 0.08991,0.286122 0.352076,0.480905 0.64674,0.480905 h 0.678158 v 4.831058 c 0,0.380764 0.3055,0.691095 0.679243,0.691095 h 6.784845 c 0.372664,0 0.678158,-0.310331 0.678158,-0.691095"
        fillOpacity="1"
        fillRule="nonzero"
        id="path2"
      />
      <path
        fill={selected ? selectedColour : colour}
        d="m 11.534288,13.366727 c 0,-4.9477086 3.957378,-8.9732256 8.820404,-8.9732256 4.863032,0 8.820404,4.025517 8.820404,8.9732256 0,4.947709 -3.957372,8.973225 -8.820404,8.973225 -4.863026,0 -8.820404,-4.025516 -8.820404,-8.973225 z m 18.997124,0 c 0,-5.7081346 -4.562949,-10.3543136 -10.17672,-10.3543136 -5.613771,0 -10.17672,4.646179 -10.17672,10.3543136 0,5.708135 4.562949,10.354314 10.17672,10.354314 5.613771,0 10.17672,-4.646179 10.17672,-10.354314"
        fillOpacity="1"
        fillRule="nonzero"
        id="path3"
      />
      <g
        clipPath="url(#4b4fdd81bd)"
        id="g4"
        transform="matrix(0.27733029,0,0,0.28172016,-31.542904,-35.523152)"
      >
        <path
          fill={selected ? selectedColour : colour}
          d="m 254.87109,242.9375 c -1.08203,1.07031 -2.53515,1.53125 -4.04297,1.22656 -0.87109,-0.17187 -1.66406,-0.59375 -2.28515,-1.22656 l -33.26563,-33.31641 c 2.3711,-1.82812 4.56641,-3.86718 6.55469,-6.10547 l 33.03906,33.08594 c 0.62891,0.63281 1.05078,1.41797 1.22266,2.28906 0.29687,1.49219 -0.14453,2.97657 -1.22266,4.04688 z M 145.54297,172.64844 c 0,-22.97266 18.65625,-41.65235 41.58984,-41.65235 22.9375,0 41.58985,18.67969 41.58985,41.65235 0,9.23437 -3.04688,17.74218 -8.15235,24.66406 -0.33203,0.11328 -0.64844,0.28516 -0.91797,0.55469 l -9.3164,9.33203 c -6.63282,4.48047 -14.61328,7.10156 -23.20313,7.10156 -22.93359,0 -41.58984,-18.68359 -41.58984,-41.65234 z m -9.78516,12.25 v -7.35157 h -4.89453 v 7.35157 h -7.33984 v -14.69922 h 17.25 c -0.0469,0.8125 -0.125,1.625 -0.125,2.44922 0,4.23828 0.62109,8.33593 1.6914,12.25 z m -2.44531,-26.38672 8.12109,5.80859 c -0.0586,0.32422 -0.0937,0.65235 -0.14453,0.97656 h -17.46875 z m 107.64453,0 9.48828,6.78515 h -17.46875 c -0.0469,-0.32421 -0.0859,-0.65234 -0.14453,-0.97656 z m 9.78516,26.38672 h -7.33985 v -7.35157 h -4.89453 v 7.35157 h -6.58203 c 1.07031,-3.91407 1.69141,-8.01172 1.69141,-12.25 0,-0.82422 -0.0781,-1.63672 -0.125,-2.44922 h 17.25 z m 7.58593,48.23828 -18.80468,-18.83594 h 21.0039 v -4.89844 h -25.89843 l -9.71875,-9.73437 c 2.17968,-3.04297 3.99609,-6.34766 5.39843,-9.86719 h 22.87891 c 1.34766,0 2.44531,-1.10156 2.44531,-2.45312 v -17.14844 h 2.44922 c 1.05859,0 2.00391,-0.69141 2.33203,-1.70703 0.32422,-1.01172 -0.0508,-2.125 -0.91015,-2.73438 l -17.125,-12.2539 c -0.85157,-0.60938 -1.9961,-0.60938 -2.84766,0 l -7.92188,5.66796 c -2.82812,-9.35156 -8.52343,-17.42968 -16.05468,-23.27734 h 44.97265 v -4.89844 h -52.76172 c -6.22265,-3.11328 -13.21484,-4.90234 -20.63281,-4.90234 -7.41406,0 -14.41015,1.78906 -20.63281,4.90234 h -52.76172 v 4.89844 h 44.97266 c -7.53125,5.84766 -13.22657,13.92578 -16.05469,23.27734 l -7.92188,-5.66796 c -0.85156,-0.60938 -1.99609,-0.60938 -2.84765,0 l -17.125,12.2539 c -0.85938,0.60938 -1.23438,1.72266 -0.90625,2.73438 0.32422,1.01562 1.26953,1.70703 2.33203,1.70703 h 2.44531 v 17.14844 c 0,1.35156 1.09766,2.45312 2.44532,2.45312 h 22.8789 c 3.09766,7.78906 8.23828,14.53516 14.75391,19.60156 h -44.97266 v 4.89844 H 166.5 c 6.22266,3.10938 13.21875,4.90234 20.63281,4.90234 8.80078,0 17,-2.50781 24.02344,-6.77734 l 33.92578,33.97656 c 1.3125,1.3125 2.97266,2.20313 4.78906,2.56641 0.61328,0.125 1.23438,0.17969 1.84375,0.17969 2.45703,0 4.83594,-0.96485 6.61328,-2.7461 2.21875,-2.21875 3.1836,-5.38672 2.5625,-8.46875 -0.36328,-1.82812 -1.2539,-3.48437 -2.5625,-4.79687"
          fillOpacity="1"
          fillRule="nonzero"
          id="path4"
        />
      </g>
    </svg>
  );
}

export function AlertsIcon({
  height = 60,
  colour = "#f7ece1",
  selected = true,
  selectedColour = "#7df2cd", //"#c470e7", //
}: {
  height?: number;
  colour?: string;
  selected?: boolean;
  selectedColour?: string;
}) {
  return (
    <svg
      width={height}
      zoomAndPan="magnify"
      viewBox="0 0 32.430496 42.311096"
      height={height}
      preserveAspectRatio="xMidYMid"
      version="1.0"
      id="svg4"
    >
      <defs id="defs2">
        <clipPath id="6b281c62fe">
          <path
            d="m 168,247 h 39 v 15.5 h -39 z m 0,0"
            clipRule="nonzero"
            id="path1"
          />
        </clipPath>
        <clipPath id="c2f80d10a5">
          <path
            d="M 119.45313,113 H 255.20312 V 243 H 119.45313 Z m 0,0"
            clipRule="nonzero"
            id="path2"
          />
        </clipPath>
      </defs>
      <g
        clipPath="url(#6b281c62fe)"
        id="g3"
        transform="matrix(0.23929807,0,0,0.28317018,-28.612011,-32.021076)"
      >
        <path
          fill={selected ? selectedColour : colour}
          d="m 187.32812,255.71484 c -5.39453,0 -10.2539,-3.19531 -12.42968,-8.15625 l -6.20313,2.71875 c 3.25,7.41016 10.55469,12.22266 18.63281,12.22266 8.19922,0 15.53516,-4.87109 18.72266,-12.43359 l -6.23047,-2.66016 c -2.14453,5.05078 -7.03515,8.30859 -12.49219,8.30859 z m 0,0"
          fillOpacity="1"
          fillRule="nonzero"
          id="path3"
        />
      </g>
      <g
        clipPath="url(#c2f80d10a5)"
        id="g4"
        transform="matrix(0.23929807,0,0,0.28317018,-28.612011,-32.021076)"
      >
        <path
          fill={selected ? selectedColour : colour}
          d="m 253.87109,232.73437 -17.89062,-14.94531 c -0.77344,-0.65625 -1.21875,-1.58203 -1.21875,-2.59765 V 174.1875 c 0,-13.12109 -5.21875,-25.34375 -14.69922,-34.40234 -5.57422,-5.32032 -12.19141,-9.08594 -19.34766,-11.17579 0.14844,-1.04687 0.20703,-2.09374 0.1211,-3.19921 -0.50782,-5.79688 -4.77344,-10.72657 -10.375,-11.98438 -4.11328,-0.92578 -8.34766,0.0312 -11.59766,2.62891 -3.21875,2.60156 -5.06641,6.45703 -5.06641,10.61328 0,0.6875 0.11719,1.3125 0.20704,1.96875 -19.79688,5.91797 -34.10547,24.6289 -34.10547,46.80469 v 39.71875 c 0,1.01562 -0.44532,1.97265 -1.22266,2.60156 l -17.88672,14.9414 c -0.77343,0.65625 -1.22265,1.61329 -1.22265,2.60157 v 3.40625 c 0,1.88281 1.51953,3.40625 3.39843,3.40625 h 128.72657 c 1.8789,0 3.39843,-1.52344 3.39843,-3.40625 v -3.40625 c -0.0273,-0.98828 -0.47656,-1.94532 -1.21875,-2.57032 z m -73.33984,-106.0664 c 0,-2.09375 0.92578,-4.00781 2.53516,-5.32031 1.64062,-1.31641 3.69531,-1.79297 5.87109,-1.31641 2.71484,0.62891 4.85937,3.10938 5.12891,5.94922 0.0312,0.38672 -0.0273,0.77344 -0.0586,1.16406 -2.95312,-0.41797 -5.93359,-0.5664 -9.0039,-0.44922 -1.49219,0.0586 -2.98047,0.21094 -4.44141,0.44922 0.0312,-0.17969 -0.0312,-0.32812 -0.0312,-0.47656 z M 128.24219,235.33203 143,222.98828 c 2.32422,-1.94141 3.66797,-4.78125 3.66797,-7.82812 v -39.71875 c 0,-22.50391 16.99219,-40.94532 38.69531,-41.96094 11.26563,-0.53906 21.91016,3.46484 30.01953,11.20703 8.10938,7.76953 12.58203,18.23047 12.58203,29.5 v 40.97266 c 0,3.01953 1.33985,5.88671 3.66407,7.82812 l 14.75781,12.34375 z m 0,0"
          fillOpacity="1"
          fillRule="nonzero"
          id="path4"
        />
      </g>
    </svg>
  );
}

export function AccountIcon({
  height = 60,
  colour = "#f7ece1",
  selected = true,
  selectedColour = "#7df2cd", //"#c470e7", //
}: {
  height?: number;
  colour?: string;
  selected?: boolean;
  selectedColour?: string;
}) {
  return (
    <svg
      width={height}
      zoomAndPan="magnify"
      viewBox="0 0 39.341415 43.486828"
      height={height}
      preserveAspectRatio="xMidYMid"
      version="1.0"
      id="svg3"
    >
      <defs id="defs1">
        <clipPath id="b2da00c2f4">
          <path
            d="m 114.1875,113 h 147 v 149 h -147 z m 0,0"
            clipRule="nonzero"
            id="path1"
          />
        </clipPath>
      </defs>
      <g
        clipPath="url(#b2da00c2f4)"
        id="g2"
        transform="matrix(0.26789954,0,0,0.29187323,-30.590779,-32.982816)"
      >
        <path
          fill={selected ? selectedColour : colour}
          d="m 255.05078,235.16016 -1.83203,4.32421 c -2.75781,0.19922 -7.57031,1.03125 -10.82031,4.23438 -3.27344,3.21094 -4.17578,8.05469 -4.41407,10.71094 l -4.3789,1.77343 c -2.04297,-1.75781 -6.07422,-4.60156 -10.72656,-4.64062 -4.5625,0 -8.59375,2.76172 -10.63672,4.46875 l -4.35157,-1.83594 c -0.19531,-2.67578 -1.01953,-7.51562 -4.24218,-10.78125 -3.22266,-3.26953 -8.07422,-4.16797 -10.75391,-4.41797 l -1.76562,-4.36718 c 1.73828,-2.02344 4.58984,-6.03125 4.64453,-10.6211 0.0234,-4.57812 -2.76172,-8.625 -4.47266,-10.67578 l 1.83203,-4.33594 c 2.75781,-0.21484 7.5586,-1.04687 10.82031,-4.24609 3.27735,-3.21484 4.17969,-8.05859 4.41797,-10.73047 l 4.375,-1.75781 c 2.02735,1.74609 6.04688,4.60156 10.63672,4.6289 h 0.10547 c 4.54688,0 8.57813,-2.75 10.62109,-4.45703 l 4.33594,1.82422 c 0.19922,2.67188 1.03516,7.52735 4.25781,10.79688 3.22266,3.26562 8.07813,4.16406 10.75391,4.40234 l 1.76563,4.36719 c -1.75,2.02344 -4.60157,6.04297 -4.64063,10.62109 -0.0273,4.58985 2.75781,8.64844 4.46875,10.71485 z M 136.85156,203.875 c 10.67578,-10.62109 25.36719,-17.19531 41.64063,-17.19531 8.77734,0 17.10547,1.92968 24.58593,5.37109 -0.0117,0.0937 -0.0391,0.17188 -0.0391,0.25 0,0 -0.0391,5.79297 -2.89062,8.59766 -2.75782,2.71093 -8.23438,2.7539 -8.64844,2.7539 h -0.0391 c -0.99219,0 -2.16016,0.69922 -2.61328,1.58594 l -3.2461,7.63281 c -0.30469,0.9375 0,2.28907 0.70313,2.98828 0,0 4.07031,4.11329 4.04297,8.1211 -0.0391,3.99609 -4.17579,8.04297 -4.17579,8.04297 -0.70312,0.70312 -1.03515,2.03906 -0.74218,2.98828 l 3.1289,7.6875 H 119.6757 c 0.69141,-15.13281 7.10938,-28.78516 17.17578,-38.82422 z m 19.35938,-31.8125 c -5.69922,-5.69922 -9.22657,-13.53125 -9.22657,-22.22266 0,-8.6875 3.52735,-16.51953 9.22657,-22.22265 5.71875,-5.6875 13.5664,-9.20313 22.28125,-9.20313 8.71093,0 16.5625,3.51563 22.27734,9.20313 5.70313,5.70312 9.23047,13.53515 9.23047,22.22265 0,8.69141 -3.52734,16.53516 -9.23047,22.22266 -5.71484,5.6875 -13.56641,9.20703 -22.27734,9.20703 -8.71485,0 -16.57813,-3.51953 -22.28125,-9.20703 z m 99.79297,52.42187 c 0.0273,-3.99609 4.17968,-8.05468 4.17968,-8.05468 0.71485,-0.6875 1.04688,-2.02344 0.74219,-2.97657 l -3.11719,-7.6875 c -0.44922,-0.88281 -1.61718,-1.61328 -2.61328,-1.625 0,0 -5.82031,-0.0273 -8.62109,-2.87109 -2.82422,-2.85547 -2.76953,-8.65234 -2.76953,-8.65234 0.0117,-0.98828 -0.70313,-2.17969 -1.57813,-2.62891 l -7.65234,-3.23047 c -0.25,-0.0781 -0.53125,-0.11719 -0.82031,-0.11719 -0.79688,0 -1.66016,0.30469 -2.17579,0.80469 0,0 -4.09765,4.03516 -8.08984,4.03516 h -0.0547 c -4.01562,-0.0273 -8.07422,-4.16406 -8.07422,-4.16406 -0.51953,-0.53125 -1.40625,-0.84766 -2.21484,-0.84766 -0.26562,0 -0.53125,0.0391 -0.76953,0.11719 l -4.48438,1.80078 c -4.33593,-2.23438 -8.97656,-3.98047 -13.8164,-5.1875 12.59765,-5.85938 21.35156,-18.57031 21.35156,-33.35938 0,-20.34375 -16.53906,-36.83593 -36.93359,-36.83593 -20.39453,0 -36.91797,16.49218 -36.9336,36.83593 0,14.76172 8.73828,27.47657 21.3125,33.33594 -27.95703,6.96875 -48.68359,32.17969 -48.68359,62.23438 0,0.71484 0.29297,1.41406 0.79688,1.91796 0.5039,0.48829 1.1914,0.78125 1.91015,0.78125 h 83.61328 c 2.06641,3.01563 2.02735,7.73829 2.02735,7.73829 -0.0117,0.99218 0.70312,2.16796 1.57812,2.63281 l 7.66406,3.22656 c 0.25391,0.0781 0.53125,0.11719 0.82422,0.11719 0.79297,0 1.65625,-0.30078 2.17188,-0.82031 0,0 4.11328,-4.03125 8.10547,-4.03125 h 0.0391 c 4.0039,0.0391 8.07422,4.17968 8.07422,4.17968 0.51953,0.52735 1.40625,0.84375 2.21484,0.84375 0.26563,0 0.53125,-0.0391 0.76953,-0.10547 l 7.70703,-3.12109 c 0.88672,-0.4375 1.61719,-1.61328 1.62891,-2.60547 0,0 0.043,-5.78125 2.89062,-8.59765 2.7461,-2.6836 8.17188,-2.75 8.63672,-2.75 h 0.0625 c 0.98438,0 2.16407,-0.70313 2.61328,-1.57422 l 3.23829,-7.63282 c 0.3164,-0.9414 0,-2.28906 -0.69141,-2.98828 0,0 -4.08594,-4.1289 -4.05859,-8.13672"
          fillOpacity="1"
          fillRule="nonzero"
          id="path2"
        />
      </g>
      <path
        fill={selected ? selectedColour : colour}
        d="m 29.228256,28.001588 h -0.0251 l 0.01047,1.579078 c 1.464031,0.01597 2.647604,1.320271 2.636092,2.903911 -0.01047,1.579081 -1.200317,2.860585 -2.671672,2.860585 -1.462983,-0.01141 -2.642368,-1.316851 -2.631904,-2.903911 0.01047,-1.579078 1.200316,-2.860585 2.65388,-2.860585 v -1.579078 c -2.248891,0 -4.089653,1.976982 -4.107444,4.428263 -0.01779,2.459259 1.805182,4.475009 4.071864,4.497812 h 0.03139 c 2.253075,0 4.086514,-1.976985 4.107445,-4.428265 0.01778,-2.46268 -1.805183,-4.475009 -4.075005,-4.49781"
        fillOpacity="1"
        fillRule="nonzero"
        id="path3"
      />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PlusIcon({
  width = 40,
  height = 40,
  colour = "black",
}: {
  width?: number;
  height?: number;
  colour?: string;
}) {
  return (
    <svg
      width={width}
      zoomAndPan="magnify"
      viewBox="0 0 29.999998 30"
      height={height}
      preserveAspectRatio="xMidYMid"
      version="1.0"
      id="svg3"
    >
      <defs id="defs1">
        <clipPath id="bb4fc407e0">
          <path
            d="m 111.5,62.832031 h 150 V 212.83203 h -150 z m 0,0"
            clipRule="nonzero"
            id="path1"
          />
        </clipPath>
      </defs>
      <g
        clipPath="url(#bb4fc407e0)"
        id="g2"
        transform="matrix(0.2,0,0,0.2,-22.3,-12.566406)"
      >
        <path
          fill={colour}
          d="m 186.5,62.832031 c -41.35547,0 -75,33.644531 -75,74.999999 0,41.35547 33.64453,75 75,75 41.35547,0 75,-33.64453 75,-75 0,-41.355468 -33.64453,-74.999999 -75,-74.999999 z m 0,135.484379 c -33.35156,0 -60.48437,-27.13282 -60.48437,-60.48438 0,-33.35156 27.13281,-60.484374 60.48437,-60.484374 33.35156,0 60.48437,27.132814 60.48437,60.484374 0,33.35156 -27.13281,60.48438 -60.48437,60.48438 z m 0,0"
          fillOpacity="1"
          fillRule="nonzero"
          id="path2"
        />
      </g>
      <path
        fill={colour}
        d="M 20.624994,13.548438 H 16.451563 V 9.3749985 c 0,-0.8023439 -0.649221,-1.4515616 -1.451568,-1.4515616 -0.801556,0 -1.451556,0.6492177 -1.451556,1.4515616 V 13.548438 H 9.3749975 c -0.8015565,0 -1.4515564,0.649218 -1.4515564,1.451562 0,0.801562 0.6499999,1.451561 1.4515564,1.451561 H 13.548439 V 20.625 c 0,0.801561 0.65,1.451561 1.451556,1.451561 0.802347,0 1.451568,-0.65 1.451568,-1.451561 v -4.173439 h 4.173431 c 0.802346,0 1.451568,-0.649999 1.451568,-1.451561 0,-0.802344 -0.649222,-1.451562 -1.451568,-1.451562 z m 0,0"
        fillOpacity="1"
        fillRule="nonzero"
        id="path3"
      />
    </svg>
  );
}

export function UploadIcon({
  width = 20,
  height = 20,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      zoomAndPan="magnify"
      viewBox="0 0 29.120565 28.299765"
      height={height}
      preserveAspectRatio="xMidYMid"
      version="1.0"
      id="svg4"
    >
      <defs id="defs2">
        <clipPath id="a5324eef2c">
          <path
            d="m 107.69531,91.296875 h 150 V 204 h -150 z m 0,0"
            clipRule="nonzero"
            id="path1"
          />
        </clipPath>
        <clipPath id="853bafb9c5">
          <path
            d="m 151,147 h 64 v 94.29687 h -64 z m 0,0"
            clipRule="nonzero"
            id="path2"
          />
        </clipPath>
      </defs>
      <g
        clipPath="url(#a5324eef2c)"
        id="g3"
        transform="matrix(0.1941371,0,0,0.1886651,-20.907655,-17.224534)"
      >
        <path
          fill="#000000"
          d="m 224.88281,138.17187 h -4.6875 v -9.375 c 0,-20.67578 -16.82422,-37.499995 -37.5,-37.499995 -20.67578,0 -37.5,16.824215 -37.5,37.499995 -20.67578,0 -37.5,16.82422 -37.5,37.5 0,20.67579 16.82422,37.5 37.5,37.5 h 23.4375 v -9.375 h -23.4375 c -15.51172,0 -28.125,-12.61328 -28.125,-28.125 0,-15.51171 12.61328,-28.125 28.125,-28.125 h 4.6875 c 2.58985,0 4.6875,-2.09765 4.6875,-4.6875 v -4.6875 c 0,-15.51171 12.61328,-28.12499 28.125,-28.12499 15.51172,0 28.125,12.61328 28.125,28.12499 v 14.0625 c 0,2.58985 2.10156,4.6875 4.6875,4.6875 h 9.375 c 12.92578,0 23.4375,10.51172 23.4375,23.4375 0,12.92188 -10.51172,23.4375 -23.4375,23.4375 h -28.125 v 9.375 h 28.125 c 18.09375,0 32.8125,-14.72265 32.8125,-32.8125 0,-18.08984 -14.71875,-32.8125 -32.8125,-32.8125 z m 0,0"
          fillOpacity="1"
          fillRule="nonzero"
          id="path3"
        />
      </g>
      <g
        clipPath="url(#853bafb9c5)"
        id="g4"
        transform="matrix(0.1941371,0,0,0.1886651,-20.907655,-17.224534)"
      >
        <path
          fill="#000000"
          d="m 207.50781,183.67187 6.62891,-6.6289 -28.125,-28.125 c -1.83594,-1.83203 -4.79688,-1.83203 -6.62891,0 l -28.125,28.125 6.62891,6.6289 20.12109,-20.12109 v 77.74609 h 9.375 v -77.74609 z m 0,0"
          fillOpacity="1"
          fillRule="nonzero"
          id="path4"
        />
      </g>
    </svg>
  );
}

export function EditIconSmall({
  width = 25,
  height = 25,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      zoomAndPan="magnify"
      viewBox="0 0 29.139402 28.781637"
      height={height}
      preserveAspectRatio="xMidYMid"
      version="1.0"
      id="svg2"
    >
      <defs id="defs1">
        <clipPath id="2735665d79">
          <path
            d="m 127,124.86328 h 151 v 149.25 H 127 Z m 0,0"
            clipRule="nonzero"
            id="path1"
          />
        </clipPath>
      </defs>
      <g
        clipPath="url(#2735665d79)"
        id="g2"
        transform="matrix(0.19480412,0,0,0.19284183,-24.836678,-24.078863)"
      >
        <path
          fill="#231f20"
          d="m 275.73437,148.84375 c -1.70703,-4.44531 -4.97265,-9.22266 -9.20312,-13.45313 -6.50781,-6.49218 -14.16016,-10.52734 -19.98047,-10.52734 -3.61719,0 -5.85937,1.47656 -7.10937,2.71485 l -6.73829,6.72656 c -0.004,0 -0.004,0 -0.004,0 l -95.78516,95.59375 c -0.0195,0.0234 -0.0352,0.0508 -0.0508,0.0703 -0.0664,0.0625 -0.11719,0.14062 -0.17187,0.21094 -0.19141,0.22265 -0.36329,0.45703 -0.50782,0.70703 -0.0547,0.0937 -0.10547,0.1875 -0.15234,0.28906 -0.14063,0.28125 -0.25,0.57422 -0.32422,0.875 -0.0117,0.0547 -0.043,0.0977 -0.0547,0.15234 l -5.73437,25.8711 c 0,0.004 0,0.008 0,0.0117 l -2.30859,10.32422 c -0.35157,1.5664 0.125,3.19921 1.26171,4.32812 0.88672,0.89063 2.08985,1.375 3.32032,1.375 0.33593,0 0.67578,-0.0391 1.01562,-0.10937 l 10.35547,-2.29297 c 0.004,-0.004 0.008,-0.004 0.008,-0.004 l 25.94531,-5.71875 c 0.0508,-0.0117 0.0898,-0.043 0.14454,-0.0547 0.30468,-0.0781 0.59375,-0.1875 0.88281,-0.32422 0.10156,-0.0469 0.1914,-0.0937 0.28906,-0.15234 0.24609,-0.14453 0.48047,-0.3125 0.71094,-0.50391 0.0664,-0.0586 0.14453,-0.10937 0.20703,-0.17187 0.0234,-0.0195 0.0508,-0.0352 0.0664,-0.0547 l 95.78906,-95.58203 v -0.004 l 6.73437,-6.73046 c 1.78516,-1.77344 4.33985,-5.89454 1.39453,-13.56641 z m -29.74218,-14.55469 c 0.0781,-0.0234 0.25781,-0.0586 0.55859,-0.0586 2.67188,0 7.98438,2.4375 13.33984,7.77734 6.64454,6.65235 8.21485,12.50781 7.7461,13.84766 l -3.35156,3.34765 -21.62891,-21.58593 z m -77.48828,120.5 -21.63282,-21.58203 89.14844,-88.96875 21.63281,21.58984 z m -24.44141,7.21875 -4.42578,-4.41797 3.33203,-15.03125 16.16016,16.125 z m 0,0"
          fillOpacity="1"
          fillRule="nonzero"
          id="path2"
        />
      </g>
    </svg>
  );
}

export function CancelIcon({
  width = 40,
  height = 40,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg height={height} viewBox="0 -960 960 960" width={width}>
      <path d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
    </svg>
  );
}

export function ConfirmIcon({
  width = 40,
  height = 40,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg height={height} viewBox="0 -960 960 960" width={width}>
      <path d="m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
    </svg>
  );
}

export function ViewIcon({
  width = 20,
  height = 20,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={(28.758156 / 21.074102) * height}
      zoomAndPan="magnify"
      viewBox="0 0 28.758156 21.074102"
      height={height}
      preserveAspectRatio="xMidYMid"
      version="1.0"
      id="svg11"
    >
      <defs id="defs5">
        <clipPath id="5660773e16">
          <path
            d="M 96.746094,126 H 246.74609 v 82.03125 H 96.746094 Z m 0,0"
            clipRule="nonzero"
            id="path1"
          />
        </clipPath>
        <clipPath id="14920695ba">
          <path
            d="M 96.746094,96.28125 H 208 V 175 H 96.746094 Z m 0,0"
            clipRule="nonzero"
            id="path2"
          />
        </clipPath>
        <clipPath id="342b5cf3db">
          <path
            d="M 96.746094,96.28125 H 170 V 194 H 96.746094 Z m 0,0"
            clipRule="nonzero"
            id="path3"
          />
        </clipPath>
        <clipPath id="824d9f1a56">
          <path
            d="M 134,96.28125 H 246.74609 V 175 H 134 Z m 0,0"
            clipRule="nonzero"
            id="path4"
          />
        </clipPath>
        <clipPath id="d13bcbf9a3">
          <path
            d="m 172,96.28125 h 74.74609 V 194 H 172 Z m 0,0"
            clipRule="nonzero"
            id="path5"
          />
        </clipPath>
      </defs>
      <g
        clipPath="url(#5660773e16)"
        id="g6"
        transform="matrix(0.19186594,0,0,0.18896916,-18.573522,-18.237389)"
      >
        <path
          fill="#000000"
          d="m 170.93359,208.10156 c -43.11718,0 -72.050778,-38.08984 -73.261715,-39.71094 l -0.867187,-1.16015 0.867187,-1.16016 c 1.207031,-1.62109 30.144535,-39.71484 73.261715,-39.71484 43.08594,0 73.53907,38.05469 74.8125,39.67578 l 0.94532,1.19922 -0.94532,1.19922 c -1.27343,1.61718 -31.72656,39.67187 -74.8125,39.67187 z m -69.24218,-40.875 c 5.23047,6.39844 32.20703,37 69.24218,37 37.03516,0 65.20703,-30.51172 70.77344,-36.99609 -5.57031,-6.48438 -33.77734,-37 -70.77344,-37 -37.03515,0 -64.01171,30.60156 -69.24218,36.99609 z m 0,0"
          fillOpacity="1"
          fillRule="nonzero"
          id="path6"
        />
      </g>
      <path
        fill="#000000"
        d="m 19.37846,13.363276 c 0,0.166824 -0.0083,0.332911 -0.02473,0.498999 -0.0165,0.166083 -0.04122,0.330696 -0.07419,0.493825 -0.03295,0.163135 -0.0742,0.32479 -0.122912,0.484236 -0.04945,0.159439 -0.105679,0.315931 -0.170881,0.470208 -0.06447,0.153534 -0.136407,0.304121 -0.215855,0.451018 -0.07945,0.146892 -0.166381,0.290095 -0.260068,0.428134 -0.09368,0.138769 -0.194863,0.272376 -0.301289,0.401556 -0.10717,0.128438 -0.220343,0.251713 -0.340259,0.369819 -0.119166,0.11737 -0.24433,0.229571 -0.374738,0.335123 -0.130409,0.105558 -0.266067,0.204474 -0.406218,0.297479 -0.140152,0.09228 -0.284799,0.177898 -0.433946,0.256145 -0.149146,0.07898 -0.301289,0.149844 -0.457183,0.214063 -0.156637,0.06348 -0.314779,0.119585 -0.476666,0.167567 -0.161886,0.0487 -0.325271,0.08932 -0.490902,0.121796 -0.165638,0.03246 -0.33202,0.05683 -0.500654,0.07308 -0.167879,0.01624 -0.335764,0.02437 -0.505147,0.02437 -0.168628,0 -0.337262,-0.0081 -0.505147,-0.02437 -0.16788,-0.01623 -0.335016,-0.04061 -0.500648,-0.07308 -0.165638,-0.03246 -0.329022,-0.07308 -0.490909,-0.121796 -0.161137,-0.04798 -0.320028,-0.104084 -0.475916,-0.167567 -0.155895,-0.06422 -0.308787,-0.13508 -0.457184,-0.214063 -0.149141,-0.07825 -0.293792,-0.163872 -0.433946,-0.256145 -0.1409,-0.09301 -0.275809,-0.191921 -0.406967,-0.297479 C 10.821697,17.190642 10.697282,17.078441 10.577367,16.961071 10.4582,16.842965 10.345032,16.71969 10.237857,16.591252 10.130682,16.462072 10.030253,16.328465 9.9365676,16.189696 9.8428776,16.051657 9.7559416,15.908454 9.6764996,15.761562 9.5970496,15.614665 9.5243566,15.464078 9.4598956,15.310544 9.3954426,15.156267 9.3384786,14.999775 9.2897655,14.840336 9.2403147,14.68089 9.1998303,14.519235 9.1668481,14.3561 9.1338433,14.192971 9.10914,14.028358 9.0926499,13.862275 9.076147,13.696187 9.0679243,13.5301 9.0679243,13.363276 c 0,-0.166088 0.00828,-0.332176 0.024726,-0.498257 0.016502,-0.166088 0.041227,-0.330697 0.074198,-0.493832 0.033005,-0.163134 0.073449,-0.32479 0.1229174,-0.484235 0.048719,-0.15944 0.1056769,-0.315932 0.1701259,-0.470209 0.06446,-0.153534 0.137156,-0.30412 0.216604,-0.451012 0.07944,-0.146898 0.166381,-0.290099 0.260068,-0.428133 0.09369,-0.138776 0.1941144,-0.272383 0.3012894,-0.401563 0.107175,-0.128438 0.220343,-0.2517133 0.33951,-0.3698193 0.119915,-0.117369 0.24433,-0.229564 0.374738,-0.335122 0.131158,-0.105558 0.266067,-0.204474 0.406967,-0.297479 0.140154,-0.092273 0.284805,-0.1778983 0.433946,-0.2561446 0.148397,-0.078983 0.301289,-0.1498444 0.457184,-0.2140634 0.155888,-0.063482 0.314779,-0.1195853 0.475916,-0.1675612 0.161887,-0.048696 0.325271,-0.08932 0.490909,-0.1218013 0.165632,-0.032464 0.332768,-0.056834 0.500648,-0.073077 0.167885,-0.016232 0.336519,-0.024376 0.505147,-0.024376 0.169383,0 0.337268,0.00814 0.505147,0.024376 0.168634,0.016231 0.335016,0.040608 0.500654,0.073077 0.165631,0.032464 0.329016,0.073083 0.490902,0.1218013 0.161887,0.047976 0.320029,0.1040794 0.476666,0.1675612 0.155894,0.064218 0.308037,0.1350805 0.457183,0.2140634 0.149147,0.078246 0.293794,0.1638716 0.433946,0.2561446 0.140151,0.09301 0.275809,0.191921 0.406218,0.297479 0.130408,0.105558 0.255572,0.217753 0.374738,0.335122 0.119916,0.118106 0.233089,0.2413813 0.340259,0.3698193 0.106425,0.12918 0.207609,0.262787 0.301289,0.401563 0.09369,0.138034 0.180626,0.281235 0.260068,0.428133 0.07945,0.146892 0.151395,0.297478 0.215855,0.451012 0.0652,0.154277 0.121413,0.310769 0.170881,0.470209 0.04872,0.159445 0.08993,0.321101 0.122912,0.484235 0.03295,0.163135 0.05771,0.327744 0.07419,0.493832 0.01651,0.166081 0.02473,0.332169 0.02473,0.498257 z m 0,0"
        fillOpacity="1"
        fillRule="nonzero"
        id="path7"
      />
      <g
        clipPath="url(#14920695ba)"
        id="g8"
        transform="matrix(0.19186594,0,0,0.18896916,-18.573522,-18.237389)"
      >
        <path
          strokeLinecap="round"
          transform="matrix(1.933086,0,0,1.936742,74.220367,69.940008)"
          fill="none"
          strokeLinejoin="miter"
          d="M 40.35118,25.236405 37.584796,14.738345"
          stroke="#000000"
          strokeWidth="2.039"
          strokeOpacity="1"
          strokeMiterlimit="10"
          id="path8"
        />
      </g>
      <g
        clipPath="url(#342b5cf3db)"
        id="g9"
        transform="matrix(0.19186594,0,0,0.18896916,-18.573522,-18.237389)"
      >
        <path
          strokeLinecap="round"
          transform="matrix(1.933086,0,0,1.936742,74.220367,69.940008)"
          fill="none"
          strokeLinejoin="miter"
          d="M 20.705614,34.937783 13.422892,26.678502"
          stroke="#000000"
          strokeWidth="2.039"
          strokeOpacity="1"
          strokeMiterlimit="10"
          id="path9"
        />
      </g>
      <g
        clipPath="url(#824d9f1a56)"
        id="g10"
        transform="matrix(0.19186594,0,0,0.18896916,-18.573522,-18.237389)"
      >
        <path
          strokeLinecap="round"
          transform="matrix(1.933086,0,0,1.936742,74.220367,69.940008)"
          fill="none"
          strokeLinejoin="miter"
          d="m 59.960372,25.236405 2.766383,-10.49806"
          stroke="#000000"
          strokeWidth="2.039"
          strokeOpacity="1"
          strokeMiterlimit="10"
          id="path10"
        />
      </g>
      <g
        clipPath="url(#d13bcbf9a3)"
        id="g11"
        transform="matrix(0.19186594,0,0,0.18896916,-18.573522,-18.237389)"
      >
        <path
          strokeLinecap="round"
          transform="matrix(1.933086,0,0,1.936742,74.220367,69.940008)"
          fill="none"
          strokeLinejoin="miter"
          d="m 79.605938,34.937783 7.282721,-8.259281"
          stroke="#000000"
          strokeWidth="2.039"
          strokeOpacity="1"
          strokeMiterlimit="10"
          id="path11"
        />
      </g>
    </svg>
  );
}
