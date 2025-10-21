import { ThemeSchema } from 'public/lib/models/common/theme.model';

export const theme: ThemeSchema = {
	extraFonts: [],
	extraFontName: 'Caveat',
	logoUrl: 'https://static.wixstatic.com/media/170496_e7f9760357224702a3865d488de6e52f~mv2.png/v1/fill/w_160,h_107,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo.png',
	logoSmUrl: 'https://static.wixstatic.com/media/1collectionItemsBaseSchema70496_e7f9760357224702a3865d488de6e52f~mv2.png/v1/fill/w_160,h_107,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo.png',
	light: {
		backgroundAndTextColors: {
			color1: '#FFF',
			color2: '#E3E3E3',
			color3: '#979797',
			color4: '#4F4F4F',
			color5: '#000000',
		},
		actionColor: {
			color1: '#E8EAED',
			color2: '#959EE5',
			color3: '#384AD3',
			color4: '#25318D',
			color5: '#131946',
		},
		moreColors1: {
			color1: '#F0D3DE',
			color2: '#F0BDD4',
			color3: '#F0A0C4',
			color4: '#D0599D',
			color5: '#D00E74',
		},
		moreColors2: {
			color1: '#B0CED1',
			color2: '#99CDD1',
			color3: '#70CBD2',
			color4: '#4FC8D1',
			color5: '#0AC4D1',
		},
		moreColors3: {
			color1: '#C7D3D5',
			color2: '#9AA9AC',
			color3: '#677E82',
			color4: '#455457',
			color5: '#222A2B',
		},
		fonts: {
			fontH1: {
				fontFamily: 'Poppins Semi Bold',
				fontSize: '88px',
				bold: false,
				italic: false,
				color: '#FFFFFF',
			},
			fontH2: {
				fontFamily: 'Poppins Semi Bold',
				fontSize: '72px',
				bold: false,
				italic: false,
				color: '#FFFFFF',
			},
			fontH3: {
				fontFamily: 'Poppins Semi Bold',
				fontSize: '50px',
				bold: false,
				italic: false,
				color: '#FFFFFF',
			},
			fontH4: {
				fontFamily: 'Poppins Semi Bold',
				fontSize: '40px',
				bold: false,
				italic: false,
				color: '#FFFFFF',
			},
			fontH5: {
				fontFamily: 'Poppins Semi Bold',
				fontSize: '28px',
				bold: false,
				italic: false,
				color: '#FFFFFF',
			},
			fontH6: {
				fontFamily: 'Poppins Semi Bold',
				fontSize: '22px',
				bold: false,
				italic: false,
				color: '#FFFFFF',
			},
			paragraph1: {
				fontFamily: 'Avenir Light',
				fontSize: '18px',
				bold: false,
				italic: false,
				color: '#FFFFFF',
			},
			paragraph2: {
				fontFamily: 'Avenir Light',
				fontSize: '15px',
				bold: false,
				italic: false,
				color: '#FFFFFF',
			},
			paragraph3: {
				fontFamily: 'Avenir Light',
				fontSize: '14px',
				bold: false,
				italic: false,
				color: '#FFFFFF',
			}
		},
	}
};