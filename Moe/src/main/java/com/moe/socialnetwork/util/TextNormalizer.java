package com.moe.socialnetwork.util;

import java.text.Normalizer;
import java.util.regex.Pattern;
/**
 * Author: nhutnm379
 */
public class TextNormalizer {
    public static String removeWhitespace(String s) {
        return s.replaceAll("\\s", ""); 
    }

    public static String removeVietnameseAccents(String input) {
        if (input == null) return null;

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

        return pattern.matcher(normalized)
                      .replaceAll("")
                      .replaceAll("đ", "d")
                      .replaceAll("Đ", "D");
    }
}
