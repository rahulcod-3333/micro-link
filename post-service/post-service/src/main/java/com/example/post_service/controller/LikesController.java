package com.example.post_service.controller;

import com.example.post_service.service.LikeService;
import com.example.post_service.service.PostService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
public class LikesController {
    private final LikeService likeService;

    @PostMapping("/{postId}")
    public ResponseEntity<Void> likePosts(@PathVariable Long postId){
        likeService.likePosts(postId , 1L);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> unlikePost(@PathVariable Long postId) {
        likeService.unlikePost(postId, 1L);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping
}
