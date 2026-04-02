package com.example.post_service.controller;

import com.example.post_service.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
public class LikesController {
    private final LikeService likeService;

    @PostMapping("/{postId}")
    public ResponseEntity<Void> likePosts(@PathVariable Long postId){
        likeService.likePosts(postId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> unlikePost(@PathVariable Long postId) {
        likeService.unlikePost(postId);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping
}
