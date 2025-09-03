import * as fs from 'fs';
import * as path from 'path';

interface CSVVerse {
  Verse: string;
  Reference: string;
  Topic: string;
}

interface ConvertedVerse {
  Verse: string;
  Reference: string;
  Topic: string;
}

interface FailedVerse {
  Verse: string;
  Reference: string;
  Topic: string;
  Reason: string;
}

// Function to convert Bible reference to XML format
function convertReferenceToXMLFormat(reference: string): string {
  // Map common book names to their abbreviations
  const bookMap: { [key: string]: string } = {
    '1 Chronicles': '1CH',
    '1 Corinthians': '1CO',
    '1 John': '1JN',
    '1 Peter': '1PE',
    '1 Samuel': '1SA',
    '1 Thessalonians': '1TH',
    '1 Timothy': '1TI',
    '2 Chronicles': '2CH',
    '2 Corinthians': '2CO',
    '2 John': '2JN',
    '2 Peter': '2PE',
    '2 Samuel': '2SA',
    '2 Thessalonians': '2TH',
    '2 Timothy': '2TI',
    'Acts': 'ACT',
    'Colossians': 'COL',
    'Daniel': 'DAN',
    'Deuteronomy': 'DEU',
    'Ecclesiastes': 'ECC',
    'Ephesians': 'EPH',
    'Esther': 'EST',
    'Exodus': 'EXO',
    'Ezekiel': 'EZK',
    'Ezra': 'EZR',
    'Galatians': 'GAL',
    'Genesis': 'GEN',
    'Habakkuk': 'HAB',
    'Haggai': 'HAG',
    'Hebrews': 'HEB',
    'Hosea': 'HOS',
    'Isaiah': 'ISA',
    'James': 'JAS',
    'Jeremiah': 'JER',
    'Job': 'JOB',
    'Joel': 'JOE',
    'John': 'JHN',
    'Jonah': 'JON',
    'Joshua': 'JOS',
    'Jude': 'JUD',
    'Judges': 'JDG',
    'Lamentations': 'LAM',
    'Leviticus': 'LEV',
    'Luke': 'LUK',
    'Malachi': 'MAL',
    'Mark': 'MRK',
    'Matthew': 'MAT',
    'Micah': 'MIC',
    'Nahum': 'NAH',
    'Nehemiah': 'NEH',
    'Numbers': 'NUM',
    'Obadiah': 'OBA',
    'Philemon': 'PHM',
    'Philippians': 'PHP',
    'Proverbs': 'PRO',
    'Psalms': 'PSA',
    'Revelation': 'REV',
    'Romans': 'ROM',
    'Ruth': 'RUT',
    'Song of Solomon': 'SNG',
    'Titus': 'TIT',
    'Zechariah': 'ZEC',
    'Zephaniah': 'ZEP'
  };

  // Extract book name and verse numbers
  const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) {
    throw new Error(`Invalid reference format: ${reference}`);
  }

  const bookName = match[1];
  const chapter = match[2];
  const verse = match[3];

  const bookAbbr = bookMap[bookName];
  if (!bookAbbr) {
    throw new Error(`Unknown book: ${bookName}`);
  }

  return `${bookAbbr}.${chapter}.${verse}`;
}

// Function to add proper sentence ending
function addSentenceEnding(text: string): string {
  const trimmed = text.trim();
  
  // If it already ends with a proper sentence ending, return as is
  if (trimmed.match(/[.!?;]$/)) {
    return trimmed;
  }
  
  // If it ends with a comma, replace with period
  if (trimmed.endsWith(',')) {
    return trimmed.slice(0, -1) + '.';
  }
  
  // Otherwise, add a period
  return trimmed + '.';
}

// Function to extract complete verse text from XML
function extractCompleteVerse(xmlContent: string, bcv: string): string {
  // Find the verse in the XML
  const versePattern = new RegExp(`<v id="[^"]*" bcv="${bcv.replace(/\./g, '\\.')}"[^>]*/>([\\s\\S]*?)(?=<v id="[^"]*" bcv="[^"]*"|<ve />|</p>)`, 'g');
  const match = versePattern.exec(xmlContent);
  
  if (!match) {
    return '';
  }

  let verseText = match[1];
  
  // Extract text from <w> tags
  const wordPattern = /<w[^>]*>([^<]+)<\/w>/g;
  let words: string[] = [];
  let wordMatch;
  
  while ((wordMatch = wordPattern.exec(verseText)) !== null) {
    words.push(wordMatch[1]);
  }
  
  let completeVerse = words.join(' ').trim();
  
  // Check if the verse ends with a comma or incomplete sentence
  // If so, try to find the complete sentence by looking at the next verse
  if (completeVerse.endsWith(',') || !completeVerse.match(/[.!?;]$/)) {
    // Extract chapter and verse numbers
    const bcvMatch = bcv.match(/^([^.]+)\.(\d+)\.(\d+)$/);
    if (bcvMatch) {
      const [, book, chapter, verse] = bcvMatch;
      const nextVerse = parseInt(verse) + 1;
      const nextBcv = `${book}.${chapter}.${nextVerse}`;
      
      // Try to get the next verse
      const nextVersePattern = new RegExp(`<v id="[^"]*" bcv="${nextBcv.replace(/\./g, '\\.')}"[^>]*/>([\\s\\S]*?)(?=<v id="[^"]*" bcv="[^"]*"|<ve />|</p>)`, 'g');
      const nextMatch = nextVersePattern.exec(xmlContent);
      
      if (nextMatch) {
        let nextVerseText = nextMatch[1];
        const nextWords: string[] = [];
        const nextWordPattern = /<w[^>]*>([^<]+)<\/w>/g;
        let nextWordMatch;
        
        while ((nextWordMatch = nextWordPattern.exec(nextVerseText)) !== null) {
          nextWords.push(nextWordMatch[1]);
        }
        
        const nextCompleteVerse = nextWords.join(' ').trim();
        
        // Combine verses until we find a proper sentence ending
        let combinedVerse = completeVerse + ' ' + nextCompleteVerse;
        
        // If still incomplete, try one more verse
        if (combinedVerse.endsWith(',') || !combinedVerse.match(/[.!?;]$/)) {
          const nextNextVerse = nextVerse + 1;
          const nextNextBcv = `${book}.${chapter}.${nextNextVerse}`;
          const nextNextVersePattern = new RegExp(`<v id="[^"]*" bcv="${nextNextBcv.replace(/\./g, '\\.')}"[^>]*/>([\\s\\S]*?)(?=<v id="[^"]*" bcv="[^"]*"|<ve />|</p>)`, 'g');
          const nextNextMatch = nextNextVersePattern.exec(xmlContent);
          
          if (nextNextMatch) {
            let nextNextVerseText = nextNextMatch[1];
            const nextNextWords: string[] = [];
            const nextNextWordPattern = /<w[^>]*>([^<]+)<\/w>/g;
            let nextNextWordMatch;
            
            while ((nextNextWordMatch = nextNextWordPattern.exec(nextNextVerseText)) !== null) {
              nextNextWords.push(nextNextWordMatch[1]);
            }
            
            const nextNextCompleteVerse = nextNextWords.join(' ').trim();
            combinedVerse = combinedVerse + ' ' + nextNextCompleteVerse;
          }
        }
        
        return addSentenceEnding(combinedVerse);
      }
    }
  }
  
  return addSentenceEnding(completeVerse);
}

// Main conversion function
function convertVerses(): void {
  try {
    // Read the original CSV file
    const csvPath = path.join(__dirname, '../data/en.csv');
    const xmlPath = path.join(__dirname, '../data/engwebp_usfx.xml');
    
    if (!fs.existsSync(csvPath)) {
      console.error('Original CSV file not found:', csvPath);
      return;
    }
    
    if (!fs.existsSync(xmlPath)) {
      console.error('XML file not found:', xmlPath);
      return;
    }
    
    console.log('Reading CSV file...');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    
    console.log('Reading XML file...');
    const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
    
    const convertedVerses: ConvertedVerse[] = [];
    const failedVerses: FailedVerse[] = [];
    
    console.log('Processing verses...');
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line (simple parsing, assumes no commas in content)
      const parts = line.split(',');
      if (parts.length < 3) continue;
      
      const verse = parts[0];
      const reference = parts[1];
      const topic = parts[2];
      
      try {
        const bcv = convertReferenceToXMLFormat(reference);
        const convertedVerse = extractCompleteVerse(xmlContent, bcv);
        
        if (convertedVerse && convertedVerse.trim()) {
          convertedVerses.push({
            Verse: convertedVerse.trim(),
            Reference: reference,
            Topic: topic
          });
        } else {
          failedVerses.push({
            Verse: verse,
            Reference: reference,
            Topic: topic,
            Reason: 'Could not find verse in XML'
          });
        }
      } catch (error) {
        failedVerses.push({
          Verse: verse,
          Reference: reference,
          Topic: topic,
          Reason: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
    
    // Write converted verses to CSV
    const convertedPath = path.join(__dirname, '../data/en_converted.csv');
    let convertedCsv = 'Verse,Reference,Topic\n';
    convertedVerses.forEach(v => {
      convertedCsv += `${v.Verse},${v.Reference},${v.Topic}\n`;
    });
    fs.writeFileSync(convertedPath, convertedCsv);
    
    // Write failed verses to CSV
    const failedPath = path.join(__dirname, '../data/en_failed.csv');
    let failedCsv = 'Verse,Reference,Topic,Reason\n';
    failedVerses.forEach(v => {
      failedCsv += `${v.Verse},${v.Reference},${v.Topic},${v.Reason}\n`;
    });
    fs.writeFileSync(failedPath, failedCsv);
    
    console.log(`\nConversion complete!`);
    console.log(`Successfully converted: ${convertedVerses.length} verses`);
    console.log(`Failed to convert: ${failedVerses.length} verses`);
    console.log(`Total processed: ${convertedVerses.length + failedVerses.length} verses`);
    console.log(`\nFiles created:`);
    console.log(`- ${convertedPath} (${convertedVerses.length + 1} lines)`);
    console.log(`- ${failedPath} (${failedVerses.length + 1} lines)`);
    
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

// Run the conversion
convertVerses();
