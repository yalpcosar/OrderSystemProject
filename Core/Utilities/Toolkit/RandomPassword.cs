using System;
namespace Core.Utilities.Toolkit
{
    /// <summary>
    /// Mobil giriş vb. için tek kullanımlık şifre üreteci.
    /// </summary>
    public static class RandomPassword
    {
        public static string CreateRandomPassword(int length = 14)
        {
            const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?_-";
            var chars = new char[length];


            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                var data = new byte[length];
                rng.GetBytes(data);

                for (int i = 0; i < length; i++)
                {
                    chars[i] = validChars[data[i] % validChars.Length];
                }
            }

            return new string(chars);
        }

        public static int RandomNumberGenerator(int min = 100000, int max = 999999)
        {

            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                var data = new byte[4];
                rng.GetBytes(data);

                int generatedValue = Math.Abs(BitConverter.ToInt32(data, 0));
                
                int diff = max - min;
                int mod = generatedValue % diff;
                return min + mod;
            }
        }
    }
}