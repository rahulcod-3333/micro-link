package com.example.post_service.controller;

import com.example.post_service.dto.PostCreateReqDto;
import com.example.post_service.dto.PostDto;
import com.example.post_service.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/core")
@RequiredArgsConstructor
@Slf4j
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody PostCreateReqDto postDto){
        postService.createNewPost(postDto);
        return ResponseEntity.ok("new post created");
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Long postId ){
      log.debug("Retrieving post with id: {}", postId);
      PostDto post = postService.getPostById(postId);
      return ResponseEntity.ok(post);

    }
    @GetMapping("/users/{userId}/allPosts")
    public ResponseEntity<List<PostDto>> getAllPostsOfUser(@PathVariable Long userId) {
        List<PostDto> posts = postService.getAllPostsOfUser(userId);
        return ResponseEntity.ok(posts);
    }
}
