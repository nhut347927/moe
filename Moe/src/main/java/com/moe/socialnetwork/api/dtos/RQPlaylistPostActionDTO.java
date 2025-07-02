package com.moe.socialnetwork.api.dtos;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RQPlaylistPostActionDTO {
    @NotBlank(message = "playlistCode cannot blank")
    private String playlistCode;
    @NotBlank(message = "postCode cannot blank")
    private String postCode;
}
