import { SizeLabelPipe } from './size-label.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { GenderLabelPipe } from './gender-label.pipe';

describe('Pipes', () => {
  describe('SizeLabelPipe', () => {
    it('should transform SizeEnum to display string', () => {
      const pipe = new SizeLabelPipe();
      expect(pipe.transform(1)).toBe('Small');
      expect(pipe.transform(2)).toBe('Medium');
      expect(pipe.transform(3)).toBe('Large');
      expect(pipe.transform(4)).toBe('Extra Large');
    });

    it('should handle null and undefined values', () => {
      const pipe = new SizeLabelPipe();
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
    });
  });

  describe('DateFormatPipe', () => {
    it('should format dates correctly', () => {
      const pipe = new DateFormatPipe(null as any);
      const testDate = new Date('2023-12-25T10:30:00');
      expect(pipe.transform(testDate)).toBe('25/12/2023 10:30');
    });

    it('should handle null and undefined values', () => {
      const pipe = new DateFormatPipe(null as any);
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
    });
  });

  describe('GenderLabelPipe', () => {
    it('should transform GenderEnum to display string', () => {
      const pipe = new GenderLabelPipe();
      expect(pipe.transform(1)).toBe('Male');
      expect(pipe.transform(2)).toBe('Female');
      expect(pipe.transform(3)).toBe('Other');
      expect(pipe.transform(4)).toBe('Not Specified');
    });

    it('should handle null and undefined values', () => {
      const pipe = new GenderLabelPipe();
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
    });
  });
});
